# Modules documentation
A brief description of the basic requirements for **StreamBurst** modules and communication within the program.

> [!NOTE]
> Documentation is a work in progress so all information provided here may change.

# Modules
Modules should be written as ESM modules and contain the relevant information in [**package.json**](#package.json), [**settings_template.json**](#settings_template.json) and the [**index.js**](#index.js) file.
Finally, the modules will be packaged in .asar files that will be responsible for communicating with specific programs.

## package.json
Necessary entries in package.json
```json
{
  "name": "module_name",
  "version": "0.0.0",
  "author": "author_name",
  "description": "...",
  "main": "index.js",
  "type": "module",
}
```
> [!IMPORTANT]
> Make sure `"type": "module"` is set

## settings_template.json
This file should contain all the configurable elements of the module.

> [!NOTE]
> Support only for **string**, **number** and **boolean** types

Example settings_template.json file

```json
{
  "name": "module_name",
  "version": "0.0.0",
  "settings":{
    "port":{
      "value":5000,
      "description":"..."
    },
    "address":{
      "value": "localhost",
      "description": "..."
    }
  }
}
```
Values from this file will be used as the default for the module. 

# index.js
The index.js file should export the class that expands the EventEmitter class.
The module class should contain public functions and properties: 
```ts
  enable()
  disable() //This should disable the module completely. All websockets, http servers, etc. should be disabled
  setSettingsFile(filePath) //You must refer to the settings based on this path.
  this.enabled: boolean
```
> [!WARNING]
> You need to reference settings based on setSettingsPath(filePath) because all user settings will be generated and stored in a different folder than the module.asar

The module should only report events and errors
```js
  this.emit("event", event);
  this.emit("error", event);
```

# Example module
File structure
```bash
module
├── package.json
├── settings_template.json
└── index.js
```
<table align="center">
<tr>
<th>
package.json
</th>
</tr>
<tr>
<td>
<pre lang="json">
{
  "name": "module_name",
  "version": "0.0.0",
  "author": "author_name",
  "description": "Brief description of the module \nLorem ipsum dolor sit amet...",
  "main": "index.js",
  "type": "module",
  "license": "MIT",
  "dependencies": {
    "@electron/asar": "^3.2.17"
  }
}
</pre>
</td>
</tr>
<tr>
<th>
settings_template.json
</th>
</tr>
<tr>
<td>
<pre lang="json">
{
  "name": "module_name",
  "version": "0.0.0",
  "settings": {
    "port": {
      "value": 5000,
      "description": "..."
    },
    "host": {
      "value": "localhost",
      "description": "..."
    }
  }
}
</pre>
</td>
</tr>
<tr>
<th>
index.js
</th>
</tr>
<tr>
<td>
  
```js
import { EventEmitter } from "events";
import http from "http";
import fs from "fs";
import { createHttpTerminator } from "http-terminator";

class ExampleModule extends EventEmitter {
  constructor() {
    super();
    this.enabled = false;
    this.settingsPath = "./settings_template.json";
    this.settings = null;
    this.server = null;
  }

  setSettingsPath(settingsPath) {
    this.settingsPath = settingsPath;
  }

  enable() {
    if (this.enabled) {
      console.log("[Example Module] Already enabled");
      return;
    }

    this.enabled = true;

    this.settings = JSON.parse(fs.readFileSync(this.settingsPath)).settings;

    console.log("[Example Module] Enabling");
    console.log("[Example Module] Settings path: " + this.settingsPath);
    console.log("[Example Module] host: " + this.settings.host);
    console.log("[Example Module] port: " + this.settings.port);

    this.server = http.createServer((req, res) => {
      if (req.method == "POST") {
        res.writeHead(200, { "Content-Type": "text/html" });

        var body = "";
        req.on("data", function (data) {
          body += data;
        });
        req.on("end", function () {
          console.log("POST payload: " + body);
          res.end("ok");
        });
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        var html =
          "<html><body>HTTP Server at http://" +
          this.settings.host.value +
          ":" +
          this.settings.port.value +
          "</body></html>";
        res.end(html);
      }
    });

    this.server.listen(this.settings.port.value, this.settings.host.value);
  }

  disable() {
    if (!this.enabled) {
      console.log("[Example Module] Already disabled");
      return;
    }

    console.log("[Example Module] Disabling");

    this.enabled = false;

    const terminator = createHttpTerminator({ server: this.server });
    terminator.terminate();
  }
}

// Export the instance of the class as the default export
export default new ExampleModule();

```
</td>
</tr>
</table>
