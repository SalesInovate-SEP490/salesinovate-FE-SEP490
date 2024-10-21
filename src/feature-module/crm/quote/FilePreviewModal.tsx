import React from 'react';
import './FilePreviewModal.css';

interface FilePreviewModalProps {
  fileUrl: string;
  fileType: string;
  onClose: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ fileUrl, fileType, onClose }) => {
  const renderPreview = () => {
    if (fileType.startsWith('image/')) {
      return <img src={fileUrl} alt="Preview" className="preview-frame" />;
    }
    if (fileType === 'application/pdf') {
      return <iframe src={fileUrl} frameBorder="0" className="preview-frame"></iframe>;
    }
    if (fileType.startsWith('text/')) {
      return <iframe src={fileUrl} frameBorder="0" className="preview-frame"></iframe>;
    }
    return <div>File type not supported</div>;
  };

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="preview-container" onClick={(e) => e.stopPropagation()}>
        {renderPreview()}
      </div>
    </div>
  );
};

export default FilePreviewModal;
