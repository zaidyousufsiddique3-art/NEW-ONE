import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../services/firebaseConfig';
import { processUploadedFile } from '../services/backendApiService';

interface FileUploaderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadComplete: () => void;
}

export const FileUploaderModal: React.FC<FileUploaderModalProps> = ({ isOpen, onClose, onUploadComplete }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setError(null);
        setSuccess(false);

        if (acceptedFiles.length === 0) return;

        setIsUploading(true);
        let successCount = 0;
        let failCount = 0;
        let specificError = null;

        for (let i = 0; i < acceptedFiles.length; i++) {
            const file = acceptedFiles[i];
            setUploadStatus(`Uploading ${i + 1}/${acceptedFiles.length}: ${file.name}...`);

            try {
                // 1. Upload to Firebase Storage
                const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);

                // 2. Save metadata to Firestore
                await addDoc(collection(db, 'files'), {
                    fileName: file.name,
                    fileUrl: downloadURL,
                    uploadedBy: 'student', // In a real app, this would be the user ID
                    uploadedAt: new Date().toISOString(),
                    size: file.size,
                    type: file.type
                });

                // 3. Process with Backend (OpenAI)
                try {
                    await processUploadedFile(downloadURL, file.name);
                } catch (backendError) {
                    console.warn(`Backend processing failed for ${file.name}, but file is in Firebase.`, backendError);
                    // Suppress error for UI
                }

                successCount++;

            } catch (err: any) {
                console.error(`Error uploading ${file.name}:`, err);
                failCount++;
                if (err.code === 'storage/unauthorized') {
                    specificError = 'Storage Permission Denied: Update Firebase Storage Rules.';
                    break; // Stop on permission error
                } else if (err.code === 'permission-denied') {
                    specificError = 'Firestore Permission Denied: Update Firebase Database Rules.';
                    break;
                } else {
                    // Keep the last error message if no specific permission error found yet
                    if (!specificError) specificError = err.message || 'Failed to upload file';
                }
            }
        }

        setIsUploading(false);

        if (successCount > 0) {
            setSuccess(true);
            if (acceptedFiles.length > 1) {
                setUploadStatus('All files uploaded successfully');
            } else {
                setUploadStatus('File uploaded successfully');
            }

            setTimeout(() => {
                onUploadComplete();
                onClose();
                setSuccess(false);
                setUploadStatus('');
            }, 2000);
        } else if (failCount > 0) {
            setError(specificError || 'Failed to upload files. Please try again.');
        }

    }, [onClose, onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.ppt', '.pptx'],
            'image/*': ['.png', '.jpg', '.jpeg']
        },
        maxFiles: 10, // Allow multiple files
        disabled: isUploading
    });

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-lg bg-[#0a0f1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Upload className="w-5 h-5 text-brand-cyan" />
                            Upload to Knowledge Hub
                        </h3>
                        <button
                            onClick={onClose}
                            disabled={isUploading}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {success ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                    <Check className="w-8 h-8 text-green-400" />
                                </div>
                                <h4 className="text-xl font-medium text-white">Upload Complete!</h4>
                                <p className="text-slate-400">{uploadStatus}</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragActive
                                        ? 'border-brand-cyan bg-brand-cyan/5'
                                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <input {...getInputProps()} />
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center">
                                            {isUploading ? (
                                                <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
                                            ) : (
                                                <Upload className="w-8 h-8 text-brand-purple" />
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-lg font-medium text-white">
                                                {isUploading ? 'Uploading...' : 'Drop your files here'}
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                {isUploading
                                                    ? uploadStatus
                                                    : 'or click to browse (PDF, DOCX, PPT, TXT)'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
