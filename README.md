# Apache SCIMple with Spring Boot and JHipster Example

To see how this application was created, please see its [demo script](demo.adoc).

If you'd like to see it running yourself, you can clone it and configure it using the instructions below.

## Getting Started

Clone Apache SCIMple's `spring-boot` branch and install it:

```
git clone -b spring-boot git@github.com:apache/directory-scimple.git
cd directory-scimple
mvn install
```

Clone this project:

```shell
git clone https://github.com/mraible/okta-scim-spring-boot-example.git
cd okta-scim-spring-boot-example
```

Configure JHipster to use Okta with the [Okta CLI](https://cli.okta.com):

```
okta apps create jhipster
```

Start the app and verify you can log in at http://localhost:8080:

```
source .okta.env
./gradlew
```

Start ngrok and copy the https URL:

```
ngrok http 8080
```

## Configure SCIM on Okta

Create a SWA app on Okta to test your SCIM settings:

1. Log in to Okta and go to **Applications**.

2. Select **Create App Integration** and select **SWA**. Enter the following values and click **Finish**.

   - App name: `SCIM Test`
   - Login URL: `http://localhost:8080`

3. In the **General** tab, edit and **Enable SCIM Provisioning**.

4. Tab over to **Provisioning** and edit the SCIM Connection.

5. Put the ngrok URL in the **Base URL** field and append `/scim` to the end. User `userName` for the unique identifier. Select all provisioning actions except for import groups.

6. Click **Test Connector Configuration**. You can check the ngrok logs at http://localhost:4040.

7. Select **To App** > **Edit** and enable all the provisioning actions, except for sync password.

8. Go to **Assignments** and assign the `ROLE_USER` group to the app.

## Test syncing identities

1. Go to http://localhost:8080 and log in. You'll be able to log in, but won't have access to any entity screens.

2. Go back to your `SCIM Test` app on Okta and select **Push Groups** > **Find groups by name**.

3. Enter `ROLE_` and select **ROLE_USER**. Push it immediately and **Save**.

4. Now if you refresh the JHipster app, you'll be able to see entity screens.

5. Go to **Assignments** and assign the `ROLE_ADMIN` group to the app. Then, configure it as a push group too.

6. Refresh your browser in the JHipster app, and you'll be able to see the **Administration** menu.
