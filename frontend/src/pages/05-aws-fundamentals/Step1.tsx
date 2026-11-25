import { InlineCode, Note, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

export function Step1() {
  return (
    <StepPage id="aws-step-1">
      <SectionTitle>Turn on MFA</SectionTitle>
      <Paragraph>MFA asks for a second proof at login. A stolen password is not enough.</Paragraph>
      <Paragraph>
        <strong>Google login:</strong>
      </Paragraph>
      <NumberedList>
        <li>Open your Google account → Security.</li>
        <li>
          Turn on <strong>2-Step Verification</strong>.
        </li>
        <li>Add a passkey or an authenticator app.</li>
        <li>Save the backup codes in a safe place, not in Git.</li>
      </NumberedList>
      <Paragraph>
        <strong>Email login:</strong> your name → Security credentials → Assign MFA device →
        Authenticator app.
      </Paragraph>
      <SectionTitle>Create a budget alert (free)</SectionTitle>
      <NumberedList>
        <li>
          In the AWS console, search <strong>Budgets</strong> → <strong>Create budget</strong>.
        </li>
        <li>
          Choose <strong>Use a template</strong> → <strong>Monthly cost budget</strong>.
        </li>
        <li>
          Name <InlineCode>devops-lab</InlineCode>, amount 5 USD, your email.
        </li>
        <li>
          Click <strong>Create budget</strong>.
        </li>
      </NumberedList>
      <Note>A budget only sends an email. It does not stop resources. You must delete them.</Note>
      <Paragraph>
        On new accounts, a budget can earn 20 USD of credits. Check <strong>Explore AWS</strong> on
        the console home.
      </Paragraph>
    </StepPage>
  )
}
