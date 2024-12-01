import { styled } from '@mui/material/styles';
import { Paper, Button, Card } from '@mui/material';

// Styled Paper component with consistent elevation and padding
export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

// Primary button with hover effect
export const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1, 3),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

// Secondary button with hover effect
export const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  padding: theme.spacing(1, 3),
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

// Styled card with hover effect
export const HoverCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

// Hero section container
export const HeroContainer = styled('div')(({ theme, backgroundImage }) => ({
  position: 'relative',
  color: theme.palette.common.white,
  padding: theme.spacing(8, 0),
  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '400px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    minHeight: '300px',
    padding: theme.spacing(4, 0),
  },
}));
