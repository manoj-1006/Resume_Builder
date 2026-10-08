import React from 'react';
import { AlertTriangle, Trash2, Shield, X } from 'lucide-react';

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  resumeTitle = 'this resume',
  isProtected = false
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {isProtected ? (
          <div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">
                      Protected Resume
                    </h3>
                    <button 
                      onClick={onClose} 
                      className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-900">"{resumeTitle}"</span> is one of your original base resumes and is protected from deletion.
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    You can create new resumes or duplicate this one, and delete newly created resumes anytime.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                Understood
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">
                      Delete Resume?
                    </h3>
                    <button 
                      onClick={onClose} 
                      className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    Are you sure you want to delete <span className="font-semibold text-slate-900">"{resumeTitle}"</span>?
                  </p>
                  <p className="mt-1 text-xs text-rose-600 font-semibold">
                    This action is permanent and cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-rose-600/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
