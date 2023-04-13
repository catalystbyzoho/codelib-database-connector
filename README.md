# Database Connector CodeLib Solution

This CodeLib solution allows you to establish an instant connection between your Catalyst application and an external database management system.

**Note:** You can get more detailed information on the steps to install and configure the Database Connector CodeLib solution from the Catalyst console. You must navigate to the bottom of your Catalyst console where you will find the **_Catalyst CodeLib_** section. You can click on the **Database Connector CodeLib** tile to access the steps.

**How does the CodeLib Solution work ?**

Upon installing this CodeLib solution, pre-defined Catalyst components specific to the solution will be added to your project. For the Database Connector CodeLib solution, we have pre-configured a [Catalyst Serverless function](https://catalyst.zoho.com/help/functions.html) ([Advanced I/O](https://catalyst.zoho.com/help/advancedio-functions.html)) in Node.js.

You will need to configure the name of the external database, its hostname and the preferred DBMS(MYSQL or PSQL) from your end in the **catalyst-config.json** file of the function. We will also be configuring a key named **CODELIB_SECRET_KEY** in the functions component and also pass it in the request header every time you try to access the endpoint of the pre-configured function in the CodeLib solution. This key allows you to access the Catalyst resources of the CodeLib solution securely.

After you have made the necessary configurations, you can invoke the **/executeQuery** endpoint of your function as a _cURL_ request to execute a query in the external database. For this, you will need to pass the username and password credentials of your database, and also the query you need to execute in the database, through the payload of the _cURL_ request. The response returns the status of the database connection and also returns the query results in the response on successful execution.

**Resources Involved:**

The following Catalyst resources are auto-configured and used as a part of the Database Connector CodeLib solution:

**1.[ Catalyst Serverless Functions](https://catalyst.zoho.com/help/functions.html) :** The **database_connector_service([Advanced I/O](https://catalyst.zoho.com/help/advancedio-functions.html))** function handles the logic to be executed for establishing a secure connection and interacting with the external database, using the values you configure in the **catalyst-config.json** file, such as the database name, host name and the preferred external DBMS( MYSQL or PSQL). When you invoke the **/executeQuery** endpoint, by passing the authentication credentials of the external database and the query to be executed in the request payload, it establishes a connection and executes the query on the external database. The response returns the status of the database connection and also returns the query results in the response on successful execution.