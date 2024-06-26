/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import styled from '@emotion/styled';

// Styled components for post details and carousel
const PostContainer = styled.div(() => ({
  width: '300px',
  margin: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  overflow: 'hidden',
}));

const UserProfile = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
  padding: '10px',
  paddingBottom: '0',
}));

const ProfileImage = styled.div(() => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#333',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  marginRight: '10px',
}));

const UserDetails = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const UserName = styled.div(() => ({
  fontWeight: 'bold',
}));

const UserEmail = styled.div(() => ({
  color: '#666',
  fontSize: '0.9rem',
}));

const CarouselContainer = styled.div(() => ({
  position: 'relative',
}));

const Carousel = styled.div(() => ({
  display: 'flex',
  overflowX: 'scroll',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  position: 'relative',
}));

const CarouselItem = styled.div(() => ({
  flex: '0 0 auto',
  scrollSnapAlign: 'start',
}));

const Image = styled.img(() => ({
  width: '280px',
  height: 'auto',
  maxHeight: '300px',
  padding: '10px',
}));

const Content = styled.div(() => ({
  padding: '10px',
  '& > h2': {
    marginBottom: '16px',
  },
}));

const Button = styled.button(() => ({
  position: 'absolute',
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  border: 'none',
  color: '#000',
  fontSize: '20px',
  cursor: 'pointer',
  height: '50px',
}));

const PrevButton = styled(Button)`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: white;
  z-index: 1;
`;

const NextButton = styled(Button)`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: white;
  z-index: 1;
`;

/**
 * Post Component
 *
 * Renders a post with user profile details, carousel of images, and content.
 *
 * @param {object} props - The component's props.
 * @param {object} props.post - The post object containing title, body, images, and user details.
 */
const Post = ({ post }) => {
  const carouselRef = useRef(null);

  // Function to handle clicking next in carousel
  const handleNextClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: carouselRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  // Function to handle clicking previous in carousel
  const handlePrevClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -carouselRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  // Function to get initials from user's name for profile image
  const getInitials = name => {
    const nameParts = name.split(' ');
    if (nameParts.length < 2) return name.charAt(0);
    return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
  };

  return (
    <PostContainer>
      {/* User profile section */}
      <UserProfile>
        <ProfileImage>{getInitials(post.user.name)}</ProfileImage>
        <UserDetails>
          <UserName>{post.user.name}</UserName>
          <UserEmail>{post.user.email}</UserEmail>
        </UserDetails>
      </UserProfile>

      {/* Carousel section for images */}
      <CarouselContainer>
        <Carousel ref={carouselRef}>
          {post.images.map((image, index) => (
            <CarouselItem key={index}>
              <Image src={image.url} alt={post.title} />
            </CarouselItem>
          ))}
        </Carousel>

        {/* Buttons for navigating carousel */}
        <PrevButton onClick={handlePrevClick}>&#10094;</PrevButton>
        <NextButton onClick={handleNextClick}>&#10095;</NextButton>
      </CarouselContainer>

      {/* Content section with post title and body */}
      <Content>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </Content>
    </PostContainer>
  );
};

// Prop types validation for the Post component
Post.propTypes = {
  post: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      }),

    ).isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
};

export default Post;
