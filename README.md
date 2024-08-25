## Backend Project Server
This is a webbserver that handles two MongoDB models concerning user login and menuItems for the purpose of storing and displaying menu items for resturant A. It contains functionality for modifying and adding content to the databases with validation and authentication restrictions. It contains limited encryption for sensitive data by the use of hashing.
It also contains some depreciated functions such as user login and registration.
### Commands
#### Depreciated Functions
##### POST "/register"
Registers a user based of input with validations to make sure its a valid unique user, only allows emails as usernames.
##### POST "/login"
Tries to log in a user if the sent data matches an actual user.
#### Relevant Functions
##### POST "/managment/adminLoginPage"
A separate login function where only one real input is allowed, since only one admin account exists and is as described in the .env file
##### POST "/management/adminCheck"
Does a validation check of the send header authorisation JWT token to check if the current user logged in within 2 hours, and returns a true or false depending on this validation.
##### POST "/managment/addMenuItem"
Creates a new menu item if the sent data matches the required input formats.
##### PUT "/managment/editMenuItem"
Edits a existing menu item with new information based of the information + item id sent
##### DELETE "/managment/removeMenuItem"
Deletes a menuItem matching the sent id
##### GET "/menuItems"
Returns a object list of the menu items, plain and simple.

Made by Max Gagner (maga2101)
