// soap-client-lib/index.js

const soapRequest = require('easy-soap-request');
const xml2js = require('xml2js');
const NodeRSA = require('node-rsa');
const nexNamespace = "http://schemas.verint.com/2010/04/12/NextivaWS/";

class SoapClient {
    constructor(url) {
        this.url = url;
        this.key = new NodeRSA();

        this.headerTemplate = {
            'Content-Type': 'text/xml;charset=UTF-8',
            'soapAction': ''
        };
    }

    async sendSoapRequest(headers, xmlRequestEnvelope, timeout = 1000) {
        try {
            const { response } = await soapRequest({
                url: this.url,
                headers: headers,
                xml: xmlRequestEnvelope,
                timeout: timeout,
            });

            const { body } = response;

            return body;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves the RSA encryption key from the server
     */
    async GetEncryptionKey() {

        console.log('GetEncryptionKey');

        // Construct the envelope for the SOAP request
        const envelope = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        <soapenv:Header/>
        <soapenv:Body>
          <GetEncryptionKey xmlns="${nexNamespace}"/>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

        // Set the header for the SOAP request
        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/GetEncryptionKey"

        // Send the SOAP request and parse the response
        const soapResponse = await this.sendSoapRequest(header, envelope, 1000);
        const result = await xml2js.parseStringPromise(soapResponse);

        // Extract and set the RSA parameters used for encryption
        const exponent = result['s:Envelope']['s:Body'][0]['GetEncryptionKeyResponse'][0]['GetEncryptionKeyResult'][0]['Exponent'][0];
        const modulus = result['s:Envelope']['s:Body'][0]['GetEncryptionKeyResponse'][0]['GetEncryptionKeyResult'][0]['Modulus'][0];
        const rsaParams = {
            e: Buffer.from(exponent, 'base64'),
            n: Buffer.from(modulus, 'base64')
        };
        this.key.setOptions({ encryptionScheme: 'pkcs1' });
        this.key.importKey(rsaParams, 'components-public');
    }

    /**
     * Logs into the server and returns the session key
     * @param username - the username to log in with
     * @param password - the password to log in with
     * @returns sessionID - the session key
     */
    async Login(username, password) {
        console.log('Login');

        // Construct a SOAP envelope with the provided credentials.
        const envelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Header>
        <IsWirelessClient xmlns="${nexNamespace}">true</IsWirelessClient>
      </soapenv:Header>
      <soapenv:Body>
        <Login xmlns="${nexNamespace}">
          <username>${this.key.encrypt(Buffer.from(username, 'utf16le'), 'base64', 'buffer')}</username>
          <password>${this.key.encrypt(Buffer.from(password, 'utf16le'), 'base64', 'buffer')}</password>
        </Login>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

        // Set the SOAP action and send the request, waiting up to 10 seconds for a response.
        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/Login";
        const response = await this.sendSoapRequest(header, envelope, 10000);

        // Parse the response and log the result.
        const parseStringPromise = require('xml2js').parseStringPromise;
        const result = await parseStringPromise(response);

        // Extract and return the session ID from the response.
        const sessionID = result['s:Envelope']['s:Body'][0]['LoginResponse'][0]['LoginResult'][0]['SessionID'][0];

        return sessionID;
    }

    /**
     * Logs out of the current session
     * @param session - the session key
     */
    async Logout(session) {
        console.log('Logout');

        const envelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Header>
        <SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
      </soapenv:Header>
      <soapenv:Body>
        <Logout xmlns="${nexNamespace}"/>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/Logout";

        const response = await this.sendSoapRequest(header, envelope, 10000);
    }


    /**
     * Sends a keep alive message to the server to keep the session alive
     * @param session - the session key
     */
    async SessionKeepAlive(session) {
        console.log('SessionKeepAlive');

        // Constructing the xml soap envelope to send to the server. The session key is retrieved from the header.
        const envelope = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
            <soapenv:Header>
                <SessionKey xmlns="${nexNamespace}">[SESSION]</SessionKey>
            </soapenv:Header>
            <soapenv:Body>
                <SessionKeepAlive xmlns="${nexNamespace}"/>
            </soapenv:Body>
          </soapenv:Envelope>
        `;

        // Replacing [SESSION] text in the envelope with the session marker passed in.
        const soapEnvelope = envelope
            .replace('[SESSION]', session);

        // Setting the soap header of the envelope with the appropriate values.
        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/SessionKeepAlive";

        // Sending the SOAP request to the server
        const response = await this.sendSoapRequest(header, soapEnvelope, 10000);
    }

    /**
     * Retrieves a list of cameras from the server
     * @param session - the session key
     * @returns cameraInfoArray - an array of camera objects
     */
    async GetCameraBasicInfo(session) {
        console.log('GetCameraBasicInfo');
        // Define the SOAP envelope with necessary elements
        const envelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        <soapenv:Header>
            <SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
        </soapenv:Header>
        <soapenv:Body>
            <GetCameraBasicInfo xmlns="${nexNamespace}">
                <filter i:nil="true" xmlns:i="http://www.w3.org/2001/XMLSchema-instance"/>
            </GetCameraBasicInfo>
        </soapenv:Body>
    </soapenv:Envelope>
    `;

        // Cache the SOAP header template with necessary SOAP action
        this.headerTemplate.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/GetCameraBasicInfo";
        const header = this.headerTemplate;

        // Send the SOAP request and parse the response
        const response = await this.sendSoapRequest(header, envelope, 10000);
        const result = await xml2js.parseStringPromise(response);

        // Extract necessary information from response and return it
        const cameraInfoArray = [];
        const cameras = result['s:Envelope']['s:Body'][0]['GetCameraBasicInfoResponse'][0]['GetCameraBasicInfoResult'][0]['CameraBasicInfo'];
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            cameraInfoArray.push({
                ResourceID: camera['ResourceID'][0],
                SiteResourceID: camera['SiteResourceID'][0],
                Name: camera['Name'][0],
                IsPtz: camera['IsPtz'][0],
            });
        }
        return cameraInfoArray;
    }

    /**
 * Retrieves cameras status
 * @param session - the session key
 * @param camera - the camera object
 * @returns cameraInfoArray - an array of camera objects
 */
    async GetCameraStatus(session, camera) {
        console.log('GetCameraStatus');
        // Define the SOAP envelope with necessary elements
        const envelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        <soapenv:Header>
            <SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
        </soapenv:Header>
        <soapenv:Body>
		<GetCameraStatus xmlns="${nexNamespace}">
			<filter xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
				<ResourceID>${camera}</ResourceID>
   				<SiteResourceID i:nil="true"/>
			</filter>
		</GetCameraStatus>
        </soapenv:Body>
    </soapenv:Envelope>
    `;

        // Cache the SOAP header template with necessary SOAP action
        this.headerTemplate.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/GetCameraStatus";
        const header = this.headerTemplate;

        // Send the SOAP request and parse the response
        const response = await this.sendSoapRequest(header, envelope, 10000);
        const result = await xml2js.parseStringPromise(response);

        // Extract necessary information from response and return it
        const cameraInfoArray = [];
        const cameras = result['s:Envelope']['s:Body'][0]['GetCameraStatusResponse'][0]['GetCameraStatusResult'][0]['CameraStatus'];
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            cameraInfoArray.push({
                ResourceID: camera['ResourceID'][0],
                SiteResourceID: camera['SiteResourceID'][0],
                Name: camera['Name'][0],
                IsPtz: camera['IsPtz'][0],
                IsOnline: camera['IsOnline'][0],
                IsRecording: camera['IsRecording'][0],
                OperationalState: camera['OperationalState'][0],
                VideoSignalState: camera['VideoSignalState'][0],
            });
        }
        return cameraInfoArray;
    }


    /**
     * Retrieves the HLS stream URL for a camera
     * @param session - the session key
     * @param camera - the camera object
     * @returns hlsUrl - HLS stream URL
     */
    async LiveMediaQueryHLS(session, camera) {


        console.log('LiveMediaQueryHLS for camera id: ', camera);

        const envelope = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
	<soapenv:Header>
		<SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
	</soapenv:Header>
	<soapenv:Body>
		<LiveMediaQueryHLS xmlns="${nexNamespace}">
			<camera xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
				<ResourceID>${camera}</ResourceID>
				<SiteResourceID i:nil="true"/>
			</camera>
			<quality>Full</quality>
			<audio>true</audio>
		</LiveMediaQueryHLS>
	</soapenv:Body>
</soapenv:Envelope>
  `;

        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/LiveMediaQueryHLS";

        const response = await this.sendSoapRequest(header, envelope, 10000);

        const result = await xml2js.parseStringPromise(response);
        const hlsUrl = result['s:Envelope']['s:Body'][0]['LiveMediaQueryHLSResponse'][0]['LiveMediaQueryHLSResult'][0]['a:string'][0];

        return hlsUrl;
    }

    /**
     * Retrieves the RTSP stream URL for a camera
     * @param session - the session key
     * @param camera - the camera object
     * @returns rtspUrl - RTSP stream URL
     */

    async LiveMediaQuery(session, camera) {
        console.log('LiveMediaQuery for camera id: ', camera);

        // Build the SOAP envelope with necessary data
        const envelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Header>
		<SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
      </soapenv:Header>
      <soapenv:Body>
        <LiveMediaQuery xmlns="${nexNamespace}">
			<camera xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
				<ResourceID>${camera}</ResourceID>
				<SiteResourceID i:nil="true"/>
			</camera>
			<quality>Full</quality>
			<audio>true</audio>
        </LiveMediaQuery>
      </soapenv:Body>
    </soapenv:Envelope>
  `;


        // Update the header and send the SOAP request
        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/LiveMediaQuery";
        const response = await this.sendSoapRequest(header, envelope, 10000);

        // Parse the response and extract the RTSP URL
        const result = await xml2js.parseStringPromise(response);
        const rtspUrl = result['s:Envelope']['s:Body'][0]['LiveMediaQueryResponse'][0]['LiveMediaQueryResult'][0]['a:string'][0];

        // Return the RTSP URL
        return rtspUrl;
    }

    /**
     * Retrieves the Playback HLS stream URL for a camera
     * @param {any} session
     * @param {any} camera
     * @param {any} startDate
     * @param {any} endDate
     * @returns hlsUrl
     */
    async PlaybackMediaQueryHLS(session, camera, startDate, endDate) {
        console.log('PlaybackMediaQueryHLS for camera id: ', camera);

        const envelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Header>
		<SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
      </soapenv:Header>
   <soapenv:Body>
      <PlaybackMediaQueryHLS xmlns="${nexNamespace}">
			<camera xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
				<ResourceID>${camera}</ResourceID>
				<SiteResourceID i:nil="true"/>
			</camera>
			<quality>Full</quality>
			<audio>true</audio>
			<start>${startDate}</start>
			<end>${endDate}</end>
      </PlaybackMediaQueryHLS>
   </soapenv:Body>
</soapenv:Envelope>
`;

        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/PlaybackMediaQueryHLS";

        const response = await this.sendSoapRequest(header, envelope, 10000);

        const result = await xml2js.parseStringPromise(response);
        const hlsUrl = result['s:Envelope']['s:Body'][0]['PlaybackMediaQueryHLSResponse'][0]['PlaybackMediaQueryHLSResult'][0]['a:string'][0];

        return hlsUrl;
    }

    /**
 * Retrieves the Playback RTSP stream URL for a camera
 * @param {any} session
 * @param {any} camera
 * @param {any} startDate
 * @param {any} endDate
 * @returns hlsUrl
 */
    async PlaybackMediaQuery(session, camera, startDate, endDate) {
        console.log('PlaybackMediaQuery for camera id: ', camera);

        const envelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Header>
		<SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
      </soapenv:Header>
   <soapenv:Body>
      <PlaybackMediaQuery xmlns="${nexNamespace}">
			<camera xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
				<ResourceID>${camera}</ResourceID>
				<SiteResourceID i:nil="true"/>
			</camera>
			<quality>Full</quality>
			<audio>true</audio>
			<start>${startDate}</start>
			<end>${endDate}</end>
      </PlaybackMediaQuery>
   </soapenv:Body>
</soapenv:Envelope>
`;

        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/PlaybackMediaQuery";

        const response = await this.sendSoapRequest(header, envelope, 10000);

        const result = await xml2js.parseStringPromise(response);
        const hlsUrl = result['s:Envelope']['s:Body'][0]['PlaybackMediaQueryResponse'][0]['PlaybackMediaQueryResult'][0]['a:string'][0];

        return hlsUrl;
    }

    /**
     * Retrieves PTZ presets array for a camera
     * @param {any} session
     * @param {any} camera
     * @returns ptzPresetInfoArray - array of preset info
     */
    async PtzGetPresetInfo(session, camera) {

        console.log('PtzGetPresetInfo for camera id: ', camera);


        const envelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Header>
		<SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
      </soapenv:Header>
    <soapenv:Body>
      <PtzGetPresetInfo xmlns="${nexNamespace}">
        <camera xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
          <ResourceID>${camera}</ResourceID>
          <SiteResourceID i:nil="true"/>
        </camera>
        <filter i:nil="true" xmlns:i="http://www.w3.org/2001/XMLSchema-instance"/>
      </PtzGetPresetInfo>
    </soapenv:Body>
  </soapenv:Envelope>
`;


        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/PtzGetPresetInfo";

        const response = await this.sendSoapRequest(header, envelope, 10000);

        const result = await xml2js.parseStringPromise(response);

        let ptzPresetInfoArray = {};

        if (result['s:Envelope']['s:Body'][0]['PtzGetPresetInfoResponse'] && result['s:Envelope']['s:Body'][0]['PtzGetPresetInfoResponse'][0]['PtzGetPresetInfoResult'][0]['PtzPresetInfo']) {
            ptzPresetInfoArray = result['s:Envelope']['s:Body'][0]['PtzGetPresetInfoResponse'][0]['PtzGetPresetInfoResult'][0]['PtzPresetInfo'].map(preset => ({
                ResourceID: preset['ResourceID'][0],
                SiteResourceID: preset['SiteResourceID'][0],
                Name: preset['Name'][0],
                Number: preset['Number'][0],
            }));

        } 

        return ptzPresetInfoArray;
    }

    /**
     * Moves PTZ to provided preset for a camera
     * @param {any} session
     * @param {any} camera
     * @param {any} presetInfo
     */
    async PTZGotoPreset(session, camera, presetInfo) {

        console.log('PTZGotoPreset for camera id: ', camera);

        const presetEnvelope = `
    <preset xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
        <ResourceID>${presetInfo.ResourceID}</ResourceID>
        <SiteResourceID>${presetInfo.SiteResourceID}</SiteResourceID>
        <Name>${presetInfo.Name}</Name>
        <Number>${presetInfo.Number}</Number>
    </preset>
`;

        const envelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Header>
		<SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
      </soapenv:Header>
        <soapenv:Body>
            <PtzGotoPreset xmlns="${nexNamespace}">
                <camera xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
                    <ResourceID>${camera}</ResourceID>
                    <SiteResourceID i:nil="true"/>
                </camera>
                ${presetEnvelope}
            </PtzGotoPreset>
        </soapenv:Body>
    </soapenv:Envelope>
`;


        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/PtzGotoPreset";

        const response = await this.sendSoapRequest(header, envelope, 10000);
    }


    /**
 * Moves PTZ to based on pan, tilt, zoom values
 * @param {any} session
 * @param {any} camera
 * @param {any} pan
 * @param {any} tile
 * @param {any} zoom
 */
    async PTZControl(session, camera, pan, tilt, zoom) {

        console.log('Move PTZ for camera id: ', camera);

        const envelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Header>
		<SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
      </soapenv:Header>
    <soapenv:Body>
      <PtzControl xmlns="${nexNamespace}">
        <camera xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
          <ResourceID>${camera}</ResourceID>
          <SiteResourceID i:nil="true"/>
        </camera>
        <panSpeed>${pan}</panSpeed>
        <tiltSpeed>${tilt}</tiltSpeed>
        <zoomSpeed>${zoom}</zoomSpeed>
      </PtzControl>
    </soapenv:Body>
  </soapenv:Envelope>
`;


        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/PtzControl";

        const response = await this.sendSoapRequest(header, envelope, 10000);
    }

    /**
* Moves PTZ to based on pan, tilt, zoom values
* @param {any} session
* @param {any} camera
* @param {any} pan
* @param {any} tile
* @param {any} zoom
*/
    async PTZAllStop(session, camera) {

        console.log('Move PTZ for camera id: ', camera);

        const envelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Header>
		<SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
      </soapenv:Header>
    <soapenv:Body>
      <PtzAllStop xmlns="${nexNamespace}">
        <camera xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
          <ResourceID>${camera}</ResourceID>
          <SiteResourceID i:nil="true"/>
        </camera>
      </PtzAllStop>
    </soapenv:Body>
  </soapenv:Envelope>
`;


        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/PtzAllStop";

        const response = await this.sendSoapRequest(header, envelope, 10000);
    }

    /**
    * Start Export for a camera
    * @param {any} session
    * @param {any} camera
    * @param {any} startDate
    * @param {any} endDate
    * @param {any} fileName
    * @returns hlsUrl
    */
    async Export(session, camera, startDate, endDate, fileName) {
        console.log('Export for camera id: ', camera);


        const soapenvNamespace = "http://schemas.xmlsoap.org/soap/envelope/";

        const envelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Header>
		<SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
      </soapenv:Header>
   <soapenv:Body>
      <Export xmlns="${nexNamespace}">
			<id xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
				<ResourceID>${camera}</ResourceID>
				<SiteResourceID i:nil="true"/>
			</id>
			<start>${startDate}</start>
			<end>${endDate}</end>
            <fileName>${fileName}</fileName>
            <exportOptions>None</exportOptions>
      </Export>
   </soapenv:Body>
</soapenv:Envelope>
`;

        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/Export";

        const response = await this.sendSoapRequest(header, envelope, 10000);

        const result = await xml2js.parseStringPromise(response);

        //const exportInfo = result['s:Envelope']['s:Body'][0]['ExportResponse'][0]['ExportResult'][0].map(exportResult => ({
        //    ResourceID: exportResult['ResourceID'][0],
        //    ExportFilesUri: exportResult['ExportFilesUri'][0]['a:string'][0],
        //    Name: exportResult['Name'][0]
        //}));

        const exportInfo = result['s:Envelope']['s:Body'][0]['ExportResponse'][0]['ExportResult'][0];


        return exportInfo;
    }


    /**
    * Check status of Export
    * @param {any} session
    * @param {any} exportId
    * @returns exportInfo
    */
    async ExportUpdateStatus(session, exportId) {
        console.log('ExportUpdateStatus for export id: ', exportId.ResourceID);


        const soapenvNamespace = "http://schemas.xmlsoap.org/soap/envelope/";

        const envelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Header>
		<SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
      </soapenv:Header>
   <soapenv:Body>
		<ExportUpdateStatus xmlns="${nexNamespace}">
			<id xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
				<ResourceID>${exportId.ResourceID}</ResourceID>
				<SiteResourceID i:nil="true"/>
			</id>
		</ExportUpdateStatus>
   </soapenv:Body>
</soapenv:Envelope>
`;

        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/ExportUpdateStatus";

        const response = await this.sendSoapRequest(header, envelope, 10000);

        const result = await xml2js.parseStringPromise(response);

        const exportInfo = result['s:Envelope']['s:Body'][0]['ExportUpdateStatusResponse'][0]['ExportUpdateStatusResult'][0];

        return exportInfo;
    }

    /**
    * Clear resources after Export
    * @param {any} session
    * @param {any} exportId
    * @returns exportInfo
    */
    async ExportDisposeServerResources(session, exportId) {
        console.log('ExportDisposeServerResources for export id: ', exportId.ResourceID);


        const soapenvNamespace = "http://schemas.xmlsoap.org/soap/envelope/";

        const envelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Header>
		<SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
      </soapenv:Header>
   <soapenv:Body>
   		<ExportDisposeServerResources xmlns="${nexNamespace}">
			<exportInfo xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
				<ResourceID>${exportId.ResourceID}</ResourceID>
				<SiteResourceID i:nil="true"/>
			</exportInfo>
		</ExportDisposeServerResources>
   </soapenv:Body>
</soapenv:Envelope>
`;

        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/ExportDisposeServerResources";

        const response = await this.sendSoapRequest(header, envelope, 10000);

        const result = await xml2js.parseStringPromise(response);
    }


    /**
    * Get open alerts
    * @param {any} session
    * @returns array of open alerts
    */
    async GetOpenAlerts(session) {
        console.log('GetOpenAlerts');


        const soapenvNamespace = "http://schemas.xmlsoap.org/soap/envelope/";

        const envelope = `
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
	<s:Header>
		<SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
	</s:Header>
	<s:Body>
		<GetAlerts xmlns="${nexNamespace}">
			<_filter xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
				<MaximumCount>0</MaximumCount>
				<AlertIDs i:nil="true"/>
				<AlertStates>
					<HealthCheckAlertStates>Open</HealthCheckAlertStates>
				</AlertStates>
				<Descriptions i:nil="true"/>
				<EventIDs i:nil="true"/>
				<FirstOccurrenceDates i:nil="true"/>
				<IsAcknowledged i:nil="true" xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays"/>
				<LastOccurrenceDates i:nil="true"/>
				<Severitys i:nil="true"/>
				<SortingInfo i:nil="true"/>
				<SourceIDs i:nil="true"/>
			</_filter>
		</GetAlerts>
	</s:Body>
</s:Envelope>
`;

        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/GetAlerts";

        const response = await this.sendSoapRequest(header, envelope, 10000);

        const result = await xml2js.parseStringPromise(response);

        let openAlarmsArray = {};

        if (result['s:Envelope']['s:Body'][0]['GetAlertsResponse'] && result['s:Envelope']['s:Body'][0]['GetAlertsResponse'][0]['GetAlertsResult'][0]['HealthCheckAlertInfo']) {
            openAlarmsArray = result['s:Envelope']['s:Body'][0]['GetAlertsResponse'][0]['GetAlertsResult'][0]['HealthCheckAlertInfo'].map(preset => ({
                ResourceID: preset['ResourceID'][0],
                AlertState: preset['AlertState'][0],
                Description: preset['Description'][0],
                EventText: preset['EventText'][0],
                Severity: preset['Severity'][0],
                SourceID: preset['SourceID'][0],
                SourceText: preset['SourceText'][0],
            }));

        }

        return openAlarmsArray;
    }

    /**
* Get closed alerts
* @param {any} session
* @returns array of open alerts
*/
    async GetClosedAlerts(session) {
        console.log('GetClosedAlerts');


        const soapenvNamespace = "http://schemas.xmlsoap.org/soap/envelope/";

        const envelope = `
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
	<s:Header>
		<SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
	</s:Header>
	<s:Body>
		<GetAlerts xmlns="${nexNamespace}">
			<_filter xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
				<MaximumCount>0</MaximumCount>
				<AlertIDs i:nil="true"/>
				<AlertStates>
					<HealthCheckAlertStates>Closed</HealthCheckAlertStates>
				</AlertStates>
				<Descriptions i:nil="true"/>
				<EventIDs i:nil="true"/>
				<FirstOccurrenceDates i:nil="true"/>
				<IsAcknowledged i:nil="true" xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays"/>
				<LastOccurrenceDates i:nil="true"/>
				<Severitys i:nil="true"/>
				<SortingInfo i:nil="true"/>
				<SourceIDs i:nil="true"/>
			</_filter>
		</GetAlerts>
	</s:Body>
</s:Envelope>
`;

        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/GetAlerts";

        const response = await this.sendSoapRequest(header, envelope, 10000);

        const result = await xml2js.parseStringPromise(response);

        let openAlarmsArray = {};

        if (result['s:Envelope']['s:Body'][0]['GetAlertsResponse'] && result['s:Envelope']['s:Body'][0]['GetAlertsResponse'][0]['GetAlertsResult'][0]['HealthCheckAlertInfo']) {
            openAlarmsArray = result['s:Envelope']['s:Body'][0]['GetAlertsResponse'][0]['GetAlertsResult'][0]['HealthCheckAlertInfo'].map(preset => ({
                ResourceID: preset['ResourceID'][0],
                AlertState: preset['AlertState'][0],
                Description: preset['Description'][0],
                EventText: preset['EventText'][0],
                Severity: preset['Severity'][0],
                SourceID: preset['SourceID'][0],
                SourceText: preset['SourceText'][0],
            }));

        }

        return openAlarmsArray;
    }

    /**
* Get alarms
* @param {any} session
* @returns array of open alerts
*/
    async GetAlarmInfo(session) {
        console.log('GetAlarmInfo');

        const envelope = `
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
	<s:Header>
		<SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
	</s:Header>
	<s:Body>
		<GetAlarmInfo xmlns="${nexNamespace}">
			<filter xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
				<ResourceID i:nil="true"/>
				<SiteResourceID i:nil="true"/>
				<AcknowledgedBy i:nil="true"/>
				<Annotation i:nil="true"/>
				<Camera i:nil="true"/>
				<ClosedTimestampEnd i:nil="true"/>
				<ClosedTimestampStart i:nil="true"/>
				<Description i:nil="true"/>
				<End i:nil="true"/>
				<IsClosed i:nil="true"/>
				<Name i:nil="true"/>
				<Priority i:nil="true"/>
				<Response i:nil="true"/>
				<Start i:nil="true"/>
				<State i:nil="true"/>
			</filter>
			<maxCount>100</maxCount>
		</GetAlarmInfo>
	</s:Body>
</s:Envelope>
`;

        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/GetAlarmInfo";

        const response = await this.sendSoapRequest(header, envelope, 10000);

        const result = await xml2js.parseStringPromise(response);

        let alarmInfoArray = {};

        if (result['s:Envelope']['s:Body'][0]['GetAlarmInfoResponse'] && result['s:Envelope']['s:Body'][0]['GetAlarmInfoResponse'][0]['GetAlarmInfoResult'][0]['AlarmInfo']) {
            const openAlarmsArray = result['s:Envelope']['s:Body'][0]['GetAlarmInfoResponse'][0]['GetAlarmInfoResult'][0]['AlarmInfo'];


            alarmInfoArray = openAlarmsArray.map(alarmInfo => {
                const attachments = alarmInfo['Attachments'][0]['AlarmAttachment'].map(attachment => {
                    const attachmentObject = {
                        type: attachment["$"]["i:type"], // Add the type here
                        ResourceID: attachment['ResourceID'][0],
                        SiteResourceID: attachment['SiteResourceID'][0],
                        Name: attachment['Name'][0],
                    };

                    if (attachment['Camera']) {
                        attachmentObject.Camera = {
                            ResourceID: attachment['Camera'][0]['ResourceID'][0],
                            SiteResourceID: attachment['Camera'][0]['SiteResourceID'][0],
                            IsAudio: attachment['Camera'][0]['IsAudio'][0],
                            IsPtz: attachment['Camera'][0]['IsPtz'][0],
                            Name: attachment['Camera'][0]['Name'][0],
                            Path: attachment['Camera'][0]['Path'] ? attachment['Camera'][0]['Path'][0] : null,
                        };
                    }

                    return attachmentObject;
                });

                return {
                    ResourceID: alarmInfo['ResourceID'][0],
                    SiteResourceID: alarmInfo['SiteResourceID'][0],
                    AcknowledgeByExternalUserName: alarmInfo['AcknowledgeByExternalUserName'] ? null : alarmInfo['AcknowledgeByExternalUserName'][0],
                    Annotation: alarmInfo['Annotation'] ? null : alarmInfo['Annotation'][0],
                    LastUpdatedTime: alarmInfo['LastUpdatedTime'] ? null : alarmInfo['LastUpdatedTime'][0],
                    AcknowledgedBy: alarmInfo['AcknowledgedBy'] ? null : alarmInfo['AcknowledgedBy'][0],
                    ClosedTimestamp: alarmInfo['ClosedTimestamp'] ? null : alarmInfo['ClosedTimestamp'][0],
                    Description: alarmInfo['Description'][0],
                    IsClosed: alarmInfo['IsClosed'][0],
                    Name: alarmInfo['Name'][0],
                    Priority: alarmInfo['Priority'][0],
                    Response: alarmInfo['Response'][0],
                    State: alarmInfo['State'][0],
                    Timestamp: alarmInfo['Timestamp'][0],
                    Attachments: attachments,
                };
            });

        }

        return alarmInfoArray;
    }

    /**
* Get Alarm attachments
* @param {any} session
* @param {any} attachmentId
* @returns attachmentInfo
*/
    async GetAlarmImageAttachmentData(session, attachmentId) {
        console.log('GetAlarmImageAttachmentData for attachment id: ', attachmentId);


        const soapenvNamespace = "http://schemas.xmlsoap.org/soap/envelope/";

        const envelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Header>
		<SessionKey xmlns="${nexNamespace}">${session}</SessionKey>
      </soapenv:Header>
   <soapenv:Body>
		<GetAlarmImageAttachmentData xmlns="${nexNamespace}">
			<image xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
				<ResourceID>${attachmentId}</ResourceID>
				<SiteResourceID i:nil="true"/>
			</image>
		</GetAlarmImageAttachmentData>
   </soapenv:Body>
</soapenv:Envelope>
`;

        const header = this.headerTemplate;
        header.soapAction = "http://schemas.verint.com/2010/04/12/NextivaWS/IService/GetAlarmImageAttachmentData";

        const response = await this.sendSoapRequest(header, envelope, 10000);

        const result = await xml2js.parseStringPromise(response);
       return result['s:Envelope']['s:Body'][0]['GetAlarmImageAttachmentDataResponse'][0]['GetAlarmImageAttachmentDataResult'][0];

    }
}

module.exports = SoapClient;
