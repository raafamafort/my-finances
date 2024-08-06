import { Box } from "@mui/material";
import { Icon } from "@iconify/react";
import { forwardRef } from "react";

const Iconify = forwardRef(({ icon, width = 20, sx, ...other }, ref) => (
  <Box
    ref={ref}
    component={Icon}
    icon={icon}
    sx={{ width, height: width, ...sx }}
  />
));

export default Iconify;
