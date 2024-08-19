import Swal from "sweetalert2";

export const showSuccessToast = (message) => {
  Swal.fire({
    icon: "success",
    title: message,
    toast: true,
    showConfirmButton: false,
    timer: 2000,
    width: "300px",
  });
};

export const showErrorToast = (message) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
    toast: true,
    showConfirmButton: false,
    timer: 3000,
  });
};
