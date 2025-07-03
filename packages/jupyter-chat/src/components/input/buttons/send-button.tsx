/*
 * Copyright (c) Jupyter Development Team.
 * Distributed under the terms of the Modified BSD License.
 */

import SendIcon from '@mui/icons-material/Send';
import React, { useEffect, useState } from 'react';

import { InputToolbarRegistry } from '../toolbar-registry';
import { TooltippedButton } from '../../mui-extras/tooltipped-button';
import { IInputModel, InputModel } from '../../../input-model';

const SEND_BUTTON_CLASS = 'jp-chat-send-button';

/**
 * The send button.
 */
export function SendButton(
  props: InputToolbarRegistry.IToolbarItemProps
): JSX.Element {
  const { model, chatCommandRegistry } = props;
  const [disabled, setDisabled] = useState(false);
  const [tooltip, setTooltip] = useState<string>('');

  useEffect(() => {
    const inputChanged = () => {
      const inputExist = !!model.value.trim() || model.attachments.length;
      setDisabled(!inputExist);
    };

    model.valueChanged.connect(inputChanged);
    model.attachmentsChanged?.connect(inputChanged);

    inputChanged();

    const configChanged = (_: IInputModel, config: InputModel.IConfig) => {
      setTooltip(
        (config.sendWithShiftEnter ?? false)
          ? 'Send message (SHIFT+ENTER)'
          : 'Send message (ENTER)'
      );
    };
    model.configChanged.connect(configChanged);

    return () => {
      model.valueChanged.disconnect(inputChanged);
      model.attachmentsChanged?.disconnect(inputChanged);
      model.configChanged?.disconnect(configChanged);
    };
  }, [model]);


  async function send() {
    await chatCommandRegistry?.onSubmit(model);
    model.send(model.value);
  }


  return (
    <TooltippedButton
      onClick={send}
      disabled={disabled}
      tooltip={tooltip}
      buttonProps={{
        size: 'small',
        title: tooltip,
        variant: 'contained',
        className: SEND_BUTTON_CLASS
      }}
    >
      <SendIcon />
    </TooltippedButton>
  );
}
