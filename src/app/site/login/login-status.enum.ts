export enum LoginStatus {
  Login = 'Login',
  ActivatingLink = 'ActivatingLink',    // which means the status that someone has confirmed their email
  InvalidLink = 'InvalidLink',          // which means the status that someone used an invalid link
  SetMobileNumber = 'SetMobileNumber',  // which means the status that the user should set their mobile
  NotVerified = 'NotVerified',          // which means the status that nothing has been verified!
  VerifiedMobile = 'VerifiedMobile',    // which means the status that mobile has been verified
  VerifiedEmail = 'VerifiedEmail',      // which means the status that email has been verified
  VerifiedBoth = 'VerifiedBoth',        // which means the status that both things has been verified
  PreferenceSize = 'PreferenceSize',    // which means the status that we are setting the preferred size
  PreferenceBrand = 'PreferenceBrand',  // which means the status that we are setting the preferred brand
  PreferenceTags = 'PreferenceTags',    // which means the status that we are setting the preferred tags
}
