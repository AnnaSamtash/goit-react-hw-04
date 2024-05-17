import css from './ImageModal.module.css';
import Modal from 'react-modal';

export default function ImageModal({ isOpen, onRequestClose, modalImageUrl }) {
  return (
    <Modal
      className={css.modal}
      overlayClassName={css.overlay}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      contentLabel="Modal image"
    >
      <img
        src={modalImageUrl}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        alt="Modal image"
      />
    </Modal>
  );
}
