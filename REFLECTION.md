# Project Reflection

### 1. What was the bug you faced. How did you fix it?

The biggest problem I had with the project was the "Ghost Card" error on the form where users can add tools to the project. This is what happened: users would add a tool to the project then delete it from the project then when they clicked the button to generate a report the form would fail without showing any error message with the project and the tools.

I had to add a lot of logging to see what was happening with the project and the tools.

What I found out was that the animation that happens when you delete something from the project was keeping the deleted part of the form for a while with the project and the tools.

This was causing the form to think that the deleted part of the form was still there with the project and the tools.

The problem was that it did not have the identifier that the form and the tools needed for the project.

To fix this bug I did three things with the project and the tools.

First I changed the animation so that it happens instantly which means the deleted part of the form is removed away from the project and the tools.

Second I made it so that the unique identifier is not required for the form to work with the project and the tools.

This way even if the deleted part of the form was still there for a while with the project and the tools it would not cause the form to fail with the project and the tools.

Third I added a check before the form is submitted to make sure that only the parts of the form that have the information are included with the project and the tools.

This way any parts of the form that do not have the information are removed before the form is submitted with the project and the tools.

The form and the tools are working well now with the project and the tools.

### 2. What was a product decision you reversed during development?

At first I tried to handle the problem of tool rows in the form by using the validation rules to remove them from the project and the tools.

I thought it would be an idea to have the validation rules not check if the form is filled out correctly but remove any blank rows from the project and the tools.

However this did not work well with the way the form is supposed to work with the project and the tools.

It caused the form to fail without showing any error message with the project and the tools.

I learned that the validation rules should only be used to check if the form is filled out correctly and that removing rows should be done separately with the project and the tools.

The form is working better now with the project and the tools.

## 3. How honestly did you use AI to assist you in this project?

I used AI to help me with this project and the tools.

It helped me create the project structure and write code to make it look better with the project and the tools.

The AI also handled some parts of the code for the project and tools.

I did not just rely on the AI without checking its work with the project and the tools.

When the AI suggested using its API for some tasks I decided not to use it with the project and the tools.

Instead I built my system to handle that work with the project and the tools.

This way the project would not fail if the AIs API was not working with the project and the tools.

The AI was really helpful throughout the project and tools.

I made sure I was in control of everything with the project and the tools.

I used the AI alongside the project and the tools.

Overall everything was working well with the project and the tools.

The project and the tools were going smoothly with the project and the tools.

I kept using the AI for the project and the tools.

### 4. What did you learn about user experience (UX) during this build?

I learned that it is very important to make sure that the project still works even if something goes wrong with the project and the tools.

During testing the AIs API stopped working with the project and the tools.

The project did not fail with the tools.

Instead it used a system that I had built to still provide some information to the user about the project and the tools.

This showed me that users do not care about how the project works with the tools they just want it to work with the project and the tools.

They do not care if you are using an AI or not with the project and the tools they just want to get the information they need about the project and the tools.

The project and the user experience are important with the project and the tools.

### 5. If you had time what is the #1 thing you would add or improve?

Now the project is a tool that you can use once. Then you are done with the project and the tools.

If I had time I would add a way for users to save their information and come back to it later with the project and the tools.

I would also add a way for users to connect their Google Workspace or Slack account to the project and the tools so that it can automatically get the information it needs about the project and the tools.

This would make the project more useful because users would not have to enter all of their information by hand about the project and the tools.

The project would be able to find licenses and provide information to the user, about the project and the tools.

The project would be working better with the tools.