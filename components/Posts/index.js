/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-key */
import axios from 'axios'; // Import Axios for making HTTP requests
import React, { useEffect, useState } from 'react'; // Import React hooks
import styled from '@emotion/styled'; // Import styled from Emotion for CSS-in-JS
import Post from './Post'; // Import Post component for rendering individual posts
import Container from '../common/Container'; // Import Container component for layout
import { useWindowWidth } from '../../context/WindowWidthContext'; // Import useWindowWidth hook for responsive behavior

// Styled component for the container of the list of posts
const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

// Styled component for the "Load More" button
const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

const Posts = () => {
  const [posts, setPosts] = useState([]); // State for storing fetched posts
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [currentPage, setCurrentPage] = useState(0); // State for current page of posts
  const [hasMorePosts, setHasMorePosts] = useState(true); // State for checking if there are more posts to load

  const { isSmallerDevice } = useWindowWidth(); // Custom hook to get window width for responsive behavior
  const postsPerPage = isSmallerDevice ? 5 : 10; // Number of posts per page based on device width

  // Effect to fetch posts when component mounts or device width changes
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true); // Set loading state to true
      try {
        // Fetch posts from API based on start and limit parameters
        const { data: fetchedPosts } = await axios.get('/api/v1/posts', {
          params: { start: 0, limit: postsPerPage },
        });
        setPosts(fetchedPosts); // Update posts state with fetched posts
        setHasMorePosts(fetchedPosts.length === postsPerPage); // Check if there are more posts to load
      } catch (error) {
        console.error('Error fetching posts:', error); // Log error if fetching posts fails
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    };

    fetchPosts(); // Call fetchPosts function when component mounts or device width changes
  }, [isSmallerDevice, postsPerPage]);

  // Function to handle "Load More" button click
  const handleClick = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      // Fetch more posts from API based on current page and posts per page
      const { data: fetchedPosts } = await axios.get('/api/v1/posts', {
        params: {
          start: (currentPage + 1) * postsPerPage,
          limit: postsPerPage,
        },
      });
      setPosts(prevPosts => [...prevPosts, ...fetchedPosts]); // Append fetched posts to existing posts
      setCurrentPage(prevPage => prevPage + 1); // Increment current page number
      setHasMorePosts(fetchedPosts.length === postsPerPage); // Check if there are more posts to load
    } catch (error) {
      console.error('Error fetching more posts:', error); // Log error if fetching more posts fails
    } finally {
      setIsLoading(false); // Set loading state to false after fetching
    }
  };

  // Render component UI
  return (
    <Container>
      {/* Container for the list of posts */}
      <PostListContainer>
        {posts.map(post => (
          <Post key={post.id} post={post} /> // Render individual Post component for each post
        ))}
      </PostListContainer>

      {/* "Load More" button section */}
      {hasMorePosts && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}{' '}
            {/* Button text based on loading state */}
          </LoadMoreButton>
        </div>
      )}
    </Container>
  );
};

export default Posts; // Export Posts component as default
