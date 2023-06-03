## liquibase usage

#### install

    npm install -save-dev liquibase@4.4.0

#### export exist db as schema, without data

    cd liquibase
    node run.js generate

custom file:

    node run.js generate export/initial-schema-20220420202020.mysql.xml

#### incremental update

    cd liquibase
    node run.js update

custom file:

    node run.js update changeLogs/changeLogs-1.0.1.mysql.xml

#### backup and incremental update

    cd liquibase
    node run.js update2

#### full update

    cd liquibase
    node run.js fullupdate

custom file:

    node run.js fullupdate export/changeLogs-1.0.1.mysql.xml

#### show status

    cd liquibase
    node run.js status

#### export exist db schema and data

    cd liquibase
    node run.js generatedata

custom file:

    node run.js generatedata export/initial-schema-data-20220420202020.mysql.xml

#### changeSet: xml-format define

example:

```
  <changeSet author="yansheng.ao (generated)" id="1647574531062-105">
    <!-- xml format -->
    <insert tableName="merchant_balance">
      <column name="mid" value="1" />
      <column name="balance" value="0" />
      <column name="onhold" value="0" />
      <column name="available_balance" value="0" />
    </insert>
  </changeSet>

```

    https://docs.liquibase.com/search.html?q=xml-format
    https://docs.liquibase.com/concepts/changelogs/xml-format.html?Highlight=xml-format

#### more detail

    see run.js
