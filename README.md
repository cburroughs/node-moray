<!--
    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<!--
    Copyright (c) 2014, Joyent, Inc.
-->

# node-moray

This repository is part of the Joyent Manta and SmartDataCenter (SDC) projects.
For  contribution guidelines, issues, and general documentation, visit the main
[SDC](http://github.com/joyent/sdc) and [Manta](http://github.com/joyent/manta)
project pages.

## Overview

This is the (node.js) client SDK for [Moray](https://github.com/joyent/moray).
For usage information, visit the Moray docs.


# Testing

To test this Moray client:

- Clone the Moray server repo.
- Use "make" to build the Moray server repo.
- Use "npm ln" to link your client repo into the server repo for the "moray"
  dependency (e.g., "cd /path/to/server/repo; npm ln /path/to/client/repo").
- Follow the instructions in the Moray server repo to test it.  Since it's using
  your client, this will exercise the test suite using your client.
