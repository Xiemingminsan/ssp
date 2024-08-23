import Swal from "sweetalert2";

export const showSuccessToast = (message) => {
  Swal.fire({
    icon: "success",
    title: message,
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 2000,
    width: "300px",
    padding: "0.5rem",
    background: "#48bb78",
    color: "#fff",
  });
};

export const showErrorToast = (message) => {
  Swal.fire({
    icon: "error",

    text: message,
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 3000,
    padding: "0.5rem",
    background: "#e53e3e",
    color: "#fff",
  });
};
