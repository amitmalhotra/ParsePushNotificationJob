# Sample Parse Push Notification Scheduled Job


A sample Parse.com Cloud Job for scheduling push notifications with randomly selected messages from a Parse Table.


## Getting Started

1. Create a table in your Parse app called NotificationMessage with following attributes:

* message - string
* inactive - bool
* locale - string (for future localization use)

2. Populate the table with some messages relevant to your push notification

3. In your app's CloudCode add the Job definition 

4. Schedule a job to run daily ( the job code has the ability to only run it weekly that you can comment out if not needed)


## How Do I Contribute?

fork and pr. 


## License

```
Copyright (c) 2015-present, iQScaleSolutions, LLC.
All rights reserved.

This source code is licensed under the MIT-style license 