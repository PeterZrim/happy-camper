import { useState, useRef } from 'react'
import {
  Box,
  Button,
  Typography,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material'
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'

function ImageUpload({
  images = [],
  onUpload,
  onDelete,
  maxImages = 5,
  accept = 'image/*',
}) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files) => {
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`)
      return
    }

    const validFiles = Array.from(files).filter(
      file => file.type.startsWith('image/')
    )

    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        onUpload({ file, preview: reader.result })
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <Box>
      <Box
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          bgcolor: dragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drag and drop images here
        </Typography>
        <Typography variant="body2" color="textSecondary">
          or click to select files
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {images.length}/{maxImages} images uploaded
        </Typography>
      </Box>

      {images.length > 0 && (
        <ImageList sx={{ mt: 2 }} cols={3} rowHeight={200} gap={8}>
          {images.map((image, index) => (
            <ImageListItem key={index}>
              <img
                src={image.preview || image.url}
                alt={`Uploaded ${index + 1}`}
                loading="lazy"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <ImageListItemBar
                actionIcon={
                  <IconButton
                    sx={{ color: 'white' }}
                    onClick={() => onDelete(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  )
}

export default ImageUpload
