# Requirements Document

## Introduction

The Friendly AI Assistant is a rule-based, fully local chatbot for the South Sudanese Learning App. It replaces the existing HiskyWidget with an interactive floating chat widget that guides users — both logged-in and logged-out — through all key platform tasks: registration, login, course discovery, payments, profile management, and notifications. The assistant uses keyword pattern-matching to select pre-written responses; it requires no external API. It must be warm, encouraging, and scoped strictly to platform knowledge.

---

## Glossary

- **Assistant**: The friendly AI chatbot component described in this document.
- **Widget**: The floating, collapsible chat bubble rendered in the bottom-right corner of the viewport.
- **Chat_Window**: The expanded panel that displays the conversation history and input field.
- **Message**: A single text entry from the User or the Assistant.
- **Conversation**: The ordered sequence of Messages in a session.
- **Pattern_Matcher**: The local, rule-based logic module that maps user input keywords to predefined Response_Templates.
- **Response_Template**: A pre-written Assistant reply associated with one or more keyword patterns.
- **Quick_Reply**: A tappable suggestion chip displayed beneath an Assistant Message to guide the next user input.
- **Session**: The in-memory state of a single Conversation, reset on page reload.
- **User**: Any visitor to the platform, authenticated or unauthenticated.
- **HiskyWidget**: The existing basic floating widget on Home.jsx that the Assistant replaces.
- **Platform**: The South Sudanese Learning App.

---

## Requirements

### Requirement 1: Widget Presence and Visibility

**User Story:** As a User, I want to see a clearly visible chat widget on every page of the platform, so that I can access help at any time during my visit.

#### Acceptance Criteria

1. THE Assistant Widget SHALL be rendered on every page of the Platform, for both authenticated and unauthenticated Users.
2. THE Widget SHALL be positioned as a fixed floating element in the bottom-right corner of the viewport with a z-index that keeps it above all other page content.
3. WHEN the Platform loads for the first time in a browser session, THE Widget SHALL default to a collapsed state showing only the launcher button.
4. THE Widget launcher button SHALL display a recognisable chat icon and the label "Ask me anything 💬" or equivalent short label.
5. THE Widget SHALL replace the existing HiskyWidget so that both components are never rendered simultaneously.

---

### Requirement 2: Open and Close Interactions

**User Story:** As a User, I want to open and close the chat window quickly, so that I can get help without losing my place on the page.

#### Acceptance Criteria

1. WHEN the User clicks the Widget launcher button, THE Assistant SHALL expand the Chat_Window and display the greeting Message.
2. WHEN the Chat_Window is open and the User clicks the close button, THE Assistant SHALL collapse the Chat_Window back to the launcher button state.
3. WHEN the Chat_Window is open and the User presses the Escape key, THE Assistant SHALL collapse the Chat_Window.
4. WHILE the Chat_Window is open, THE Widget SHALL not obstruct the main page scroll by consuming pointer events outside the Chat_Window bounds.
5. THE Widget SHALL persist its open or closed state within a single browser session so that navigating between routes does not reset the Chat_Window state.

---

### Requirement 3: Greeting Message

**User Story:** As a User, I want to receive a welcoming greeting when I first open the assistant, so that I immediately understand its purpose and feel encouraged to ask questions.

#### Acceptance Criteria

1. WHEN the Chat_Window is opened for the first time in a Session, THE Assistant SHALL display the greeting: "Hello and welcome! 👋😊 I'm your friendly learning companion for the South Sudanese Learning App. I'm here to help you every step of the way and make your learning journey simple, enjoyable, and successful."
2. WHEN the greeting Message is displayed, THE Assistant SHALL also render the following Quick_Reply chips: "How do I register?", "How do I log in?", "What courses are available?", "How do I pay for a course?", "Help me navigate the platform".
3. THE greeting Message SHALL be shown only once per Session; re-opening the Widget within the same Session SHALL resume the existing Conversation.

---

### Requirement 4: Keyword Pattern Matching

**User Story:** As a User, I want the assistant to understand my questions and reply with relevant, accurate information about the platform, so that I can complete tasks without searching through menus.

#### Acceptance Criteria

1. THE Pattern_Matcher SHALL evaluate each user Message against a defined set of keyword patterns using case-insensitive matching.
2. WHEN a user Message contains keywords related to registration (e.g., "sign up", "register", "create account"), THE Pattern_Matcher SHALL select the Registration Response_Template.
3. WHEN a user Message contains keywords related to login (e.g., "log in", "sign in", "login", "password"), THE Pattern_Matcher SHALL select the Login Response_Template.
4. WHEN a user Message contains keywords related to courses or subjects (e.g., "course", "subject", "notes", "textbook", "past paper", "quiz", "senior"), THE Pattern_Matcher SHALL select the Courses Response_Template.
5. WHEN a user Message contains keywords related to payments (e.g., "pay", "payment", "unlock", "purchase", "subscribe", "subscription"), THE Pattern_Matcher SHALL select the Payment Response_Template.
6. WHEN a user Message contains keywords related to profile (e.g., "profile", "account settings", "personal info", "update name"), THE Pattern_Matcher SHALL select the Profile Response_Template.
7. WHEN a user Message contains keywords related to notifications (e.g., "notification", "update", "announcement", "alert"), THE Pattern_Matcher SHALL select the Notifications Response_Template.
8. WHEN a user Message contains keywords related to navigation (e.g., "navigate", "find", "where", "how to use", "menu"), THE Pattern_Matcher SHALL select the Navigation Response_Template.
9. WHEN a user Message contains keywords related to the platform's purpose (e.g., "what is this", "about", "platform", "mission", "what can i do"), THE Pattern_Matcher SHALL select the Platform_Overview Response_Template.
10. IF a user Message does not match any known keyword pattern, THEN THE Pattern_Matcher SHALL select the Fallback Response_Template, which states that the assistant can only answer questions about the South Sudanese Learning App and lists available topics.

---

### Requirement 5: Response Content Accuracy

**User Story:** As a User, I want the assistant's answers to be accurate and specific to the platform, so that I can follow the instructions and complete my tasks successfully.

#### Acceptance Criteria

1. THE Registration Response_Template SHALL describe the registration flow in this order: click "Sign Up" → enter full name → enter email address → create a password → submit to complete registration.
2. THE Login Response_Template SHALL describe the login flow in this order: go to the login page → enter registered email address → enter password → click "Sign In".
3. THE Courses Response_Template SHALL state that the Platform offers Notes, Quizzes, Textbooks, and Past Papers for Senior 1–4 of the South Sudanese secondary school curriculum, and SHALL direct the User to browse the class selector on the home page.
4. THE Payment Response_Template SHALL instruct the User to follow the on-screen payment instructions, wait for verification, and confirm that the course will be unlocked after successful verification.
5. THE Profile Response_Template SHALL instruct the User to navigate to profile settings to update personal information.
6. THE Notifications Response_Template SHALL explain that notifications contain important platform updates, learning opportunities, and announcements, and SHALL direct the User to the Notifications page.
7. THE Navigation Response_Template SHALL provide a concise overview of the main navigation sections: Home, Classes (Senior 1–4), My Learning, Profile, and Notifications.
8. THE Platform_Overview Response_Template SHALL state the Platform mission: making learning accessible, engaging, and empowering, and SHALL describe the target audience as South Sudanese secondary school students Senior 1–4.
9. IF a topic or feature is not available on the Platform, THEN THE Assistant SHALL honestly state that the feature is not currently available rather than fabricating information.
10. IF THE Assistant lacks sufficient information to answer a user Message, THEN THE Assistant SHALL state that it does not have enough information and suggest the User contact support.

---

### Requirement 6: Quick Reply Chips

**User Story:** As a User, I want to see suggested follow-up options after each assistant reply, so that I can continue the conversation without typing.

#### Acceptance Criteria

1. WHEN the Assistant sends a Response_Template Message, THE Assistant SHALL render a set of contextually relevant Quick_Reply chips beneath the Message.
2. WHEN the User taps a Quick_Reply chip, THE Assistant SHALL treat the chip label as a new user Message and process it through the Pattern_Matcher.
3. THE Quick_Reply chips for the Registration Response_Template SHALL include: "How do I log in?", "What courses are available?", "Back to main menu".
4. THE Quick_Reply chips for the Login Response_Template SHALL include: "I forgot my password", "How do I register?", "Back to main menu".
5. THE Quick_Reply chips for the Courses Response_Template SHALL include: "How do I pay for a course?", "How do I navigate?", "Back to main menu".
6. THE Quick_Reply chips for the Fallback Response_Template SHALL include the labels of all primary topic areas so the User can select a supported topic.

---

### Requirement 7: Conversation History Display

**User Story:** As a User, I want to see the full conversation history while the chat window is open, so that I can review previous answers without losing context.

#### Acceptance Criteria

1. THE Chat_Window SHALL display all Messages of the current Conversation in chronological order, oldest at the top and newest at the bottom.
2. THE User's Messages SHALL be visually distinguished from the Assistant's Messages (e.g., different alignment or background colour).
3. WHEN a new Message is added to the Conversation, THE Chat_Window SHALL automatically scroll to the most recent Message.
4. THE Chat_Window SHALL have a fixed maximum height with internal scrolling so that it does not overflow the viewport.

---

### Requirement 8: Message Input

**User Story:** As a User, I want to type my own question and send it to the assistant, so that I can ask about topics not covered by the Quick Reply chips.

#### Acceptance Criteria

1. THE Chat_Window SHALL include a text input field and a send button.
2. WHEN the User types in the input field and presses Enter or clicks the send button, THE Assistant SHALL add the user Message to the Conversation and invoke the Pattern_Matcher.
3. IF the User attempts to send an empty Message, THEN THE Assistant SHALL not add the Message to the Conversation and SHALL not invoke the Pattern_Matcher.
4. WHEN a user Message is sent, THE input field SHALL be cleared.
5. THE input field SHALL include placeholder text such as "Type your question…" to guide the User.

---

### Requirement 9: Tone and Persona

**User Story:** As a User, I want the assistant to communicate in a friendly and encouraging way, so that I feel supported throughout my learning journey.

#### Acceptance Criteria

1. THE Assistant SHALL use friendly, warm, and encouraging language in all Response_Templates.
2. THE Assistant SHALL use emojis appropriately to reinforce a positive tone, with at least one emoji in every Response_Template.
3. THE Assistant SHALL address the User in second person ("you") in all Response_Templates.
4. THE Assistant SHALL maintain a consistent persona named as the "South Sudanese Learning App Assistant" across all Response_Templates.

---

### Requirement 10: Knowledge Boundary Enforcement

**User Story:** As a User, I want the assistant to be honest when it cannot answer a question, so that I do not receive misleading information.

#### Acceptance Criteria

1. THE Pattern_Matcher SHALL only produce Response_Templates that contain information about the South Sudanese Learning App.
2. IF a user Message requests general knowledge, news, maths solutions, or any content unrelated to the Platform, THEN THE Assistant SHALL respond with the Fallback Response_Template and SHALL not attempt to answer the off-topic question.
3. THE Fallback Response_Template SHALL include a clear statement that the Assistant is scoped to Platform help only and SHALL list the topics it can assist with.

---

### Requirement 11: Accessibility

**User Story:** As a User with accessibility needs, I want the chat widget to be usable with a keyboard and compatible with screen readers, so that I am not excluded from getting help.

#### Acceptance Criteria

1. THE Widget launcher button SHALL have a descriptive `aria-label` attribute.
2. THE Chat_Window SHALL trap keyboard focus within itself while it is open, and SHALL return focus to the launcher button when it is closed.
3. THE input field SHALL be automatically focused when the Chat_Window opens.
4. Every interactive element in the Widget (launcher button, send button, close button, Quick_Reply chips) SHALL be reachable and activatable via keyboard Tab and Enter keys.
5. THE Chat_Window SHALL include an `aria-live="polite"` region so that screen readers announce new Assistant Messages.

---

### Requirement 12: Replacement of HiskyWidget

**User Story:** As a developer, I want the new Assistant to fully replace the existing HiskyWidget, so that there is a single, consistent help experience across the platform.

#### Acceptance Criteria

1. THE Assistant SHALL be available on all routes of the Platform (not only the Home page), for both authenticated and unauthenticated Users.
2. WHEN the Assistant is present, THE HiskyWidget component SHALL not be rendered anywhere in the application.
3. THE existing HiskyWidget source file MAY be retained for reference but SHALL be removed from all import statements and render trees.
4. THE Assistant component SHALL be mounted at the application root level (e.g., inside App.jsx) so that it persists across route changes without remounting.
