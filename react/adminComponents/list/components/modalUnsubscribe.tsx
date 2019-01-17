import * as React from 'react'

import { IconSpinner, Modal, Button } from 'gocommerce.styleguide'
import { FormattedMessage } from 'react-intl'

interface ModalUnsubscribeProps {
  isOpen: boolean
  isActionLoading: boolean
  close: Function
  action: Function
  intl?: any
}

interface ModalUnsubscribeState {}

class ModalUnsubscribe extends React.Component<ModalUnsubscribeProps, ModalUnsubscribeState> {
  render() {
    const { isOpen, close, isActionLoading, action } = this.props

    return (
      <>
        <Modal open={isOpen} onClose={close} showCloseIcon={true} centered={false}>
          <div>
            <p className="g-ma0 g-f4 fw6">
              <FormattedMessage id="newsletter-modal.admin.modal-unsubscribe-title" />
            </p>
            <p className="g-mv5 g-f2 lh-copy">
              <FormattedMessage id="newsletter-modal.admin.modal-unsubscribe-description" />
            </p>
            <div className="g-mt8 flex justify-between">
              <Button size="large" disabled={isActionLoading} style="secondary" className="pointer" onClick={close}>
                <FormattedMessage id="newsletter-modal.admin.modal-unsubscribe-no" />
              </Button>

              <Button size="large" style="danger" className="pointer" onClick={action} isDisabled={false}>
                {this.props.intl.formatMessage({ id: 'newsletter-modal.admin.modal-unsubscribe-yes' })}{' '}
                {isActionLoading ? <IconSpinner animate /> : null}
              </Button>
            </div>
          </div>
        </Modal>
      </>
    )
  }
}

export default ModalUnsubscribe
