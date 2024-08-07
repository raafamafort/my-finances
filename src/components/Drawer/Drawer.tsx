import { NAV_BAR_CONFIG } from '@lib/utils/navbarConfig';
import { useRouter } from 'next/navigation';
import Logo from '@components/Logo/Logo';
import {
  Box,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  useMediaQuery,
} from '@mui/material';
import { Icon } from '@iconify/react';

const drawerWidth = 280;

interface DrawerProps {
  open: boolean;
  toggleDrawer: () => void;
}

export default function Drawer({ open, toggleDrawer }: DrawerProps) {
  const router = useRouter();

  const isWideScreen = useMediaQuery('(min-width:960px)');

  const onClickItem = (path: string) => {
    router.push(path);
    router.refresh();
    if (!isWideScreen) toggleDrawer();
  };

  return (
    <>
      <MuiDrawer
        variant={isWideScreen ? 'persistent' : 'temporary'}
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#0E1C2D',
            borderRight: '1px solid #94A3B8',
            transition: 'background-color 0.3s',
          },
        }}
      >
        <Box
          sx={{
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            padding: '12px',
          }}
        >
          <Logo />
          <List
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: '24px',
            }}
          >
            {NAV_BAR_CONFIG.map(item => (
              <ListItem
                key={item.label}
                sx={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                  },
                  '& .MuiListItemButton-root': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <ListItemButton onClick={() => onClickItem(item.path)}>
                  <ListItemIcon
                    sx={{
                      color: '#94A3B8',
                      fontSize: '28px',
                    }}
                  >
                    <Box component={Icon} icon={item.icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '1.3rem',
                      color: '#FFFFFF',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </MuiDrawer>
    </>
  );
}
