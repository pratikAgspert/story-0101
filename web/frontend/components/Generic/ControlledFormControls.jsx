import React from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Switch,
} from "@chakra-ui/react";

import { useController } from "react-hook-form";

export const FormSwitch = ({
  control,
  inputName,
  label,
  validationRules = {},
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  switchProps = {},
  onChange,
  ...props
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: inputName,
    rules: { ...validationRules },
    control,
  });

  return (
    <FormControl
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={error}
      isReadOnly={isReadOnly}
    >
      <HStack
        py={2}
        justifyContent={"flex-start"}
        alignItems={"center"}
        gap={3}
      >
        <Switch
          {...field}
          id={inputName}
          {...props}
          isChecked={field?.value}
          onChange={(e) => {
            field?.onChange(e);
            onChange && onChange(e);
          }}
          {...switchProps}
        />
        <FormLabel textTransform={"capitalize"} htmlFor={inputName} mb={0}>
          {label ?? inputName}
        </FormLabel>
      </HStack>

      {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
    </FormControl>
  );
};

// export default FormSwitch;
