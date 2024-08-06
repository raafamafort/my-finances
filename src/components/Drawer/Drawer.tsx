import { Box, Drawer as MuiDrawer, List, ListItem, ListItemText } from '@mui/material';

const drawerWidth = 240;

interface DrawerProps {
  open: boolean;
}

export default function Drawer({open}: DrawerProps) {

  return (
    <>
      <MuiDrawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text) => (
              <ListItem key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </MuiDrawer>
    </>
  );
};
