import { Box, Button, Modal, Typography } from "@mui/material";
import useModalStore from "../../store/modalStore";

const DynamicModal = () => {
  const { isOpen, title, message, onConfirm, onCancel, close } =
    useModalStore();
  return (
    <Modal open={isOpen} onClose={close}>
      <Box
        sx={{
          px: 4,
          py: 2,
          bgcolor: "background.paper",
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          gap: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body1">{message}</Typography>
        <Box
          sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}
        >
          <Button
            onClick={() => {
              onCancel();
              close();
            }}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              close();
            }}
            color="primary"
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DynamicModal;
