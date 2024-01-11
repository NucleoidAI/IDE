import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

import { Grid, Tooltip, Typography, tooltipClasses } from "@mui/material";

const DialogTooltip = styled(
  ({
    className,
    open,
    handleTooltipClose,
    title,
    message,
    footer,
    ...props
  }) => (
    <Tooltip
      open={open}
      onClose={handleTooltipClose}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      title={
        <>
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: (theme) => theme.palette.background.paper,
            }}
          >
            <Typography variant="subtitle1" sx={{ flexGrow: 1, marginLeft: 2 }}>
              {title}
            </Typography>
            <IconButton onClick={handleTooltipClose} size="small">
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid sx={{ padding: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: (theme) => theme.palette.text.primary }}
            >
              {message}
            </Typography>
            {footer}
          </Grid>
        </>
      }
      {...props}
      classes={{ popper: className }}
    />
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    width: 600,
    fontSize: theme.typography.pxToRem(12),
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[1],
  },
}));

export default DialogTooltip;
