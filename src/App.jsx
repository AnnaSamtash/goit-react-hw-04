import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import { fetchPhotosByQuery } from './gallery-api';
import ImageGallery from './components/ImageGallery/ImageGallery';
import Loader from './components/Loader/Loader';
import LoadMoreBtn from './components/LoadMoreBtn/LoadMoreBtn';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';
import ImageModal from './components/ImageModal/ImageModal';
import './App.css';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (searchQuery.trim() === '') {
      return;
    }
    async function fetchPhotos() {
      try {
        setError(false);
        setLoading(true);
        if (page > totalPages) {
          return;
        }
        const data = await fetchPhotosByQuery(searchQuery, page);
        if (data.total_pages === 0) {
          setErrorMsg(
            'Sorry, there are no images matching your search query. Please try again!'
          );
          setError(true);
          return;
        }
        setTotalPages(data.total_pages);
        setPhotos(prevPhotos => {
          return [...prevPhotos, ...data.results];
        });
      } catch (error) {
        setErrorMsg(`${error.message} Please try again!`);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, [page, searchQuery]);

  const handleSearch = async query => {
    setPhotos([]);
    setSearchQuery(query);
    setPage(1);
  };

  const handleLoadMore = async () => {
    setPage(page + 1);
  };

  // =============modal==============

  Modal.setAppElement('#root');

  function openModal(imgUrl) {
    setIsOpen(true);
    setModalImage(imgUrl);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />
      {photos.length > 0 && <ImageGallery items={photos} onClick={openModal} />}
      {loading && <Loader />}
      {error && !loading && <ErrorMessage>{errorMsg}</ErrorMessage>}
      {page === totalPages && photos.length > 0 && (
        <p
          style={{
            fontSize: 'medium',
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          We`re sorry, there are no more images to load!
        </p>
      )}
      {page < totalPages && !loading && photos.length > 0 && (
        <LoadMoreBtn onClick={handleLoadMore} />
      )}
      <ImageModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        modalImageUrl={modalImage}
      />
      <Toaster />
    </div>
  );
};

export default App;
