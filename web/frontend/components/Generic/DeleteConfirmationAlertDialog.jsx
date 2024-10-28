import { useRef } from 'react';

import {
  IconButton,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';

import React from 'react';

export const DeleteConfirmationAlertDialog = ({
  alertTitle,
  alertDescription,
  onConfirm,
  onCancel,
  triggerButtonProps = {},
  cancelButtonProps = {},
  confirmButtonProps = {},
  alertDialogProps = {},
  isPending = false,
  noCloseIcon = false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const { isIconButton = false, ...triggerProps } = triggerButtonProps;

  return (
    <>
      <>
        {isIconButton && (
          <IconButton
            {...triggerProps}
            onClick={(e) => {
              e?.stopPropagation();
              onOpen();
            }}
          />
        )}

        {!isIconButton && (
          <Button
            {...triggerProps}
            onClick={(e) => {
              e?.stopPropagation();
              onOpen();
            }}
          >
            {triggerButtonProps?.label ?? 'Delete'}
          </Button>
        )}
      </>

      <AlertDialog
        motionPreset="slideInTop"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        {...alertDialogProps}
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader fontSize={'x-large'}>
            {alertTitle}
          </AlertDialogHeader>
          {!noCloseIcon && <AlertDialogCloseButton />}
          <AlertDialogBody fontWeight={'500'}>
            {alertDescription}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              {...cancelButtonProps}
              onClick={() => {
                onCancel && onCancel();
                onClose();
              }}
            >
              {cancelButtonProps?.label ?? 'Cancel'}
            </Button>

            <Button
              colorScheme="red"
              ml={3}
              {...confirmButtonProps}
              onClick={() => {
                onConfirm && onConfirm();
                onClose();
              }}
            >
              {isPending ? <Spinner /> : confirmButtonProps?.label ?? 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteConfirmationAlertDialog;
