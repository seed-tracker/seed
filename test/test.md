# **Seed Testing**

# _Basic Tests_

## Links
*   Click all links to make sure that they go to the page they should be. There should be no loading/delays/flashing screen when being redirected

## Input fields
*   Fill out all of the fields to make sure that data is being submitted - compare to db in MongoDB
    *   For fields that are required or have specifications:
        *   Test required fields by leaving blank. There should be an error message upon hitting submit and the data should **NOT** be sent to database
        *   Test specifications by purposely not meeting the requirement. There should be an error message upon hitting submit and the data should **NOT** be sent to database. Test each requirement individually to make sure each requirement's code is working.
        
## Graphs
    *   Title should clearly state what the graph shows. If any filters are the default view, they should be selected upon load
    *   Filters need to be tested to make sure any change in selection will cause graph to dynamically update.




# New User
## Sign up
    1.  Clicking on Sign up button in Navbar takes user to 'Sign up' Page
    2.  Fill out all of the required fields. Note: *all the fields are required*
        *   Test to see if the required fields returns an error message *   if specifications are not met upon hitting submit
        *   Username: error if left blank or is already taken
        *   Password:
            *   error if left blank
            *   error if it does not meet specifications - test each one individually (less than 8 characters, no number, all lowercase, no special)
        *   Email:
            *   error if left blank
            *   error if already in use
            *   error if not in email format (does not end in @xxx.com or something)
        *   Full Name: error if left blank. Are there any other rules here? Like there needs to be two words?
        *   DOB: requires mm/dd/yyyy format. Is there any age limitation?  
3. Click Submit
*   if successful: User should be redirected to 'My Profile' page
*   if not successful, an error message should appear  


# Logged in User
## My Profile
*   If user does not have any correlations, no graphs are shown. Only the stats and facts & a message saying that not enough data available yet and to encourage users to keep logging
*   If user does have correlations, expect to see 2 graphs. 
    *   First is a line graph that shows most common symptoms symptom & their related food group count over a specified period of time
        *   User should be able to move the slider to change time period and the graph should dynamically change with it. 
    *   Second is a dropdown list of other graphs to view. This includes the bubble chart, circle packing, etc.
    *   User should be able to 


# Look & Feel