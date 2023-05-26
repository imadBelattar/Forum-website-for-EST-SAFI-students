import React, { useState } from "react";
import "./LogoutButton.css";
import { Modal } from "react-bootstrap";

const LogoutButton = ({ logout }) => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleConfirm = () => {
    logout();
    closeModal();
  };

  return (
    <div>
      <button className="btn btn-danger logout" onClick={openModal}>
        Exit
      </button>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header className="modal-custom" closeButton>
          {" "}
          <Modal.Title> Confirm to log out..</Modal.Title>
        </Modal.Header>

        <Modal.Body className="modal-custom">
          <h5>Are you sure you want to exit ?</h5>
        </Modal.Body>
        <Modal.Footer className="modal-custom">
          <button className="btn btn-secondary logout" onClick={closeModal}>
            No
          </button>
          <button
            className="btn btn-danger logout yesBTN"
            onClick={handleConfirm}>
            yes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LogoutButton;
