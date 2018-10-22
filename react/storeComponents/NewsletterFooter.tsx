import * as React from 'react'
import { graphql, compose } from 'react-apollo'
import Cookies from 'universal-cookie'
import { Modal, Input, Button } from 'vtex.styleguide'
import addNewsletterOmsProfile from './graphql/addNewsletterOmsProfile.gql'

const cookies = new Cookies()

interface NewsletterModalProps {
  boxTitle: string
  boxIntro: string
  boxComplete: string
  addNewsletterOmsProfile: Function
}

class NewsletterModal extends React.Component<NewsletterModalProps, {}> {
  static defaultProps = {
    active: false,
    boxTitle: 'Newsletter',
    boxIntro: 'Se inscreva em nossa newsletter e receba promoções',
    boxComplete: 'Cadastro realizado com sucesso!',
  }
  state = {
    isModalOpen: false,
    emailValue: '',
    isSending: false,
    isSuccess: false
  }
  componentDidMount() {
    console.log('MMMMMMMMM', cookies.get('VtexCustomWorkspace'))
    this.setState({
      isModalOpen: true
    })
  }
  onClose = () => {
    this.setState({
      isModalOpen: false
    })
  }
  handleSubmit = (e) => {
    this.setState({
      isSending: true
    })
    this.props
      .addNewsletterOmsProfile({
        variables: {
          data: {
            email: this.state.emailValue,
            isNewsletterOptIn: true,
            updatedIn: new Date().toISOString()
          }
        }
      })
      .then(({ data }) => {
        if(data && (!data.userErrors || !data.userErrors.length)) {
          this.setState({
            isSuccess: true
          })
        } else {
          console.log(data.userErrors)
        }
      })
      .catch(error => {
        console.log('there was an error sending the query', error)
      })
      .then(() => {
        this.setState({
          isSending: false
        })
      })
    e.preventDefault()
  }
  render() {
    const { isModalOpen, emailValue, isSending, isSuccess } = this.state
    const { active, boxTitle, boxIntro, boxComplete } = this.props
    return active && (
      <Modal centered isOpen={isModalOpen} onClose={this.onClose}>
        <div className="newsletterModal-container">
          <div className="newsletterModal-title">{boxTitle}</div>
          {isSuccess ? (
            <div className="newsletterModal-success">
              <p>{boxComplete}</p>
            </div>
          ) : (
            <div className="newsletterModal-intro">
              <p>{boxIntro}</p>
              <form onSubmit={this.handleSubmit} className="flex">
                <Input type="email" placeholder="E-mail" value={emailValue} required onChange={e => this.setState({ emailValue: e.target.value })} />
                <div className="ml3">
                  <Button type="submit" variation="primary" size="small" isLoading={isSending}>
                    Send
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </Modal>
    )
  }
}

const NewsletterModalWithIntl = compose(
  graphql(addNewsletterOmsProfile, {
    name: 'addNewsletterOmsProfile'
  })
)(NewsletterModal)

NewsletterModalWithIntl.schema = {
  title: 'editor.newsletterModal.configs.componentTitle',
  description: 'editor.newsletterModal.configs.componentDescription',
  type: 'object',
  properties: {
    active: {
      type: 'boolean',
      title: 'editor.newsletterModal.configs.active',
      default: NewsletterModal.defaultProps.active,
    },
    boxTitle: {
      type: 'string',
      title: 'editor.newsletterModal.configs.title',
      default: NewsletterModal.defaultProps.boxTitle,
      isLayout: true,
    },
    boxIntro: {
      type: 'string',
      title: 'editor.newsletterModal.configs.intro',
      default: NewsletterModal.defaultProps.boxIntro,
      isLayout: true,
    },
    boxComplete: {
      type: 'string',
      title: 'editor.newsletterModal.configs.complete',
      default: NewsletterModal.defaultProps.boxComplete,
      isLayout: true,
    },
  },
}

export default NewsletterModalWithIntl
