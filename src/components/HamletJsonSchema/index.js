/*
    These components do not render any elements, they are used for processing the Hamlet JSONSchema.
*/
/* AttributeSet Imports */
import linkSchema from "@site/static/schema/latest/blueprint/schema-attributeset-link-schema.json";
import computeimageSchema from "@site/static/schema/latest/blueprint/schema-attributeset-computeimage-schema.json";
import contextpathSchema from "@site/static/schema/latest/blueprint/schema-attributeset-contextpath-schema.json";
import ecsComputeImageSchema from "@site/static/schema/latest/blueprint/schema-attributeset-ecs_computeimage-schema.json";
import osSchema from "@site/static/schema/latest/blueprint/schema-attributeset-operatingsystem-schema.json";
import osPatchingSchema from "@site/static/schema/latest/blueprint/schema-attributeset-ospatching-schema.json";
import awsComputeImageSchema from "@site/static/schema/latest/blueprint/schema-attributeset-aws_computeimage-schema.json";
import awsEcsComputeImageSchema from "@site/static/schema/latest/blueprint/schema-attributeset-aws_ecs_computeimage-schema.json";
import awsOsSchema from "@site/static/schema/latest/blueprint/schema-attributeset-aws_operatingsystem-schema.json";

/* Reference Data Imports */
import alertProfileSchema from "@site/static/schema/latest/blueprint/schema-reference-alertprofile-schema.json";
import alertRuleSchema from "@site/static/schema/latest/blueprint/schema-reference-alertrule-schema.json";
import baselineProfileSchema from "@site/static/schema/latest/blueprint/schema-reference-baselineprofile-schema.json";
import bootstrap from "@site/static/schema/latest/blueprint/schema-reference-bootstrap-schema.json";
import bootstrapProfile from "@site/static/schema/latest/blueprint/schema-reference-bootstrapprofile-schema.json";
import corsProfile from "@site/static/schema/latest/blueprint/schema-reference-corsprofile-schema.json";
import category from "@site/static/schema/latest/blueprint/schema-reference-category-schema.json";
import certBehaviour from "@site/static/schema/latest/blueprint/schema-reference-certificatebehaviour-schema.json";
import computeProvider from "@site/static/schema/latest/blueprint/schema-reference-computeprovider-schema.json";
import countryGroup from "@site/static/schema/latest/blueprint/schema-reference-countrygroup-schema.json";
import deploymentGroup from "@site/static/schema/latest/blueprint/schema-reference-deploymentgroup-schema.json";
import deploymentMode from "@site/static/schema/latest/blueprint/schema-reference-deploymentmode-schema.json";
import deploymentProfile from "@site/static/schema/latest/blueprint/schema-reference-deploymentprofile-schema.json";
import ipAddrGroup from "@site/static/schema/latest/blueprint/schema-reference-ipaddressgroup-schema.json";
import logFile from "@site/static/schema/latest/blueprint/schema-reference-logfile-schema.json";
import logFileGroup from "@site/static/schema/latest/blueprint/schema-reference-logfilegroup-schema.json";
import logFileProfile from "@site/static/schema/latest/blueprint/schema-reference-logfileprofile-schema.json";
import logFilter from "@site/static/schema/latest/blueprint/schema-reference-logfilter-schema.json";
import loggingProfile from "@site/static/schema/latest/blueprint/schema-reference-loggingprofile-schema.json";
import networkEndpointGroup from "@site/static/schema/latest/blueprint/schema-reference-networkendpointgroup-schema.json";
import networkProfile from "@site/static/schema/latest/blueprint/schema-reference-networkprofile-schema.json";
import placementProfile from "@site/static/schema/latest/blueprint/schema-reference-placementprofile-schema.json";
import policyProfile from "@site/static/schema/latest/blueprint/schema-reference-policyprofile-schema.json";
import port from "@site/static/schema/latest/blueprint/schema-reference-port-schema.json";
import portMapping from "@site/static/schema/latest/blueprint/schema-reference-portmapping-schema.json";
import processor from "@site/static/schema/latest/blueprint/schema-reference-processor-schema.json";
import region from "@site/static/schema/latest/blueprint/schema-reference-region-schema.json";
import scriptStore from "@site/static/schema/latest/blueprint/schema-reference-scriptstore-schema.json";
import securityProfile from "@site/static/schema/latest/blueprint/schema-reference-securityprofile-schema.json";
import serviceRole from "@site/static/schema/latest/blueprint/schema-reference-servicerole-schema.json";
import storage from "@site/static/schema/latest/blueprint/schema-reference-storage-schema.json";
import testCase from "@site/static/schema/latest/blueprint/schema-reference-testcase-schema.json";
import testProfile from "@site/static/schema/latest/blueprint/schema-reference-testprofile-schema.json";
import wafCondition from "@site/static/schema/latest/blueprint/schema-reference-wafcondition-schema.json";
import wafProfile from "@site/static/schema/latest/blueprint/schema-reference-wafprofile-schema.json";
import wafRule from "@site/static/schema/latest/blueprint/schema-reference-wafrule-schema.json";
import wafRuleGroup from "@site/static/schema/latest/blueprint/schema-reference-wafrulegroup-schema.json";
import wafValueSet from "@site/static/schema/latest/blueprint/schema-reference-wafvalueset-schema.json";

/* Component Imports */
import adaptor from  "@site/static/schema/latest/blueprint/schema-component-adaptor-schema.json";
import apigateway from  "@site/static/schema/latest/blueprint/schema-component-apigateway-schema.json";
import apiusageplan from "@site/static/schema/latest/blueprint/schema-component-apiusageplan-schema.json";
import baseline from "@site/static/schema/latest/blueprint/schema-component-baseline-schema.json";
import baselinedata from "@site/static/schema/latest/blueprint/schema-component-baselinedata-schema.json";
import baselinekey from "@site/static/schema/latest/blueprint/schema-component-baselinekey-schema.json";
import s3 from "@site/static/schema/latest/blueprint/schema-component-s3-schema.json";
import ec2 from "@site/static/schema/latest/blueprint/schema-component-ec2-schema.json";
import bastion from "@site/static/schema/latest/blueprint/schema-component-bastion-schema.json";
import cache from "@site/static/schema/latest/blueprint/schema-component-cache-schema.json";
import cdn from "@site/static/schema/latest/blueprint/schema-component-cdn-schema.json";
import cdnroute from "@site/static/schema/latest/blueprint/schema-component-cdnroute-schema.json";
import computecluster from "@site/static/schema/latest/blueprint/schema-component-computecluster-schema.json";
import configstore from "@site/static/schema/latest/blueprint/schema-component-configstore-schema.json";
import configbranch from "@site/static/schema/latest/blueprint/schema-component-configbranch-schema.json";
import containerhost from "@site/static/schema/latest/blueprint/schema-component-containerhost-schema.json";
import containerservice from "@site/static/schema/latest/blueprint/schema-component-containerservice-schema.json";
import containertask from "@site/static/schema/latest/blueprint/schema-component-containertask-schema.json";
import contenthub from "@site/static/schema/latest/blueprint/schema-component-contenthub-schema.json";
import contentnode from "@site/static/schema/latest/blueprint/schema-component-contentnode-schema.json";
import datafeed from "@site/static/schema/latest/blueprint/schema-component-datafeed-schema.json";
import datapipeline from "@site/static/schema/latest/blueprint/schema-component-datapipeline-schema.json";
import dataset from "@site/static/schema/latest/blueprint/schema-component-dataset-schema.json";
import datavolume from "@site/static/schema/latest/blueprint/schema-component-datavolume-schema.json";
import db from "@site/static/schema/latest/blueprint/schema-component-db-schema.json";
import ecs from "@site/static/schema/latest/blueprint/schema-component-ecs-schema.json";
import service from "@site/static/schema/latest/blueprint/schema-component-service-schema.json";
import task from "@site/static/schema/latest/blueprint/schema-component-task-schema.json";
import efs from "@site/static/schema/latest/blueprint/schema-component-efs-schema.json";
import efsmount from "@site/static/schema/latest/blueprint/schema-component-efsmount-schema.json";
import elasticsearch from "@site/static/schema/latest/blueprint/schema-component-es-schema.json";
import externalnetwork from "@site/static/schema/latest/blueprint/schema-component-externalnetwork-schema.json";
import externalnetworkconnection from "@site/static/schema/latest/blueprint/schema-component-externalnetworkconnection-schema.json";
import externalservice from "@site/static/schema/latest/blueprint/schema-component-externalservice-schema.json";
import externalserviceendpoint from "@site/static/schema/latest/blueprint/schema-component-externalserviceendpoint-schema.json";
import federatedrole from "@site/static/schema/latest/blueprint/schema-component-federatedrole-schema.json";
import federatedroleassignment from "@site/static/schema/latest/blueprint/schema-component-federatedroleassignment-schema.json";
import filetransfer from "@site/static/schema/latest/blueprint/schema-component-filetransfer-schema.json";
import gateway from "@site/static/schema/latest/blueprint/schema-component-gateway-schema.json";
import gatewaydestination from "@site/static/schema/latest/blueprint/schema-component-gatewaydestination-schema.json";
import globaldb from "@site/static/schema/latest/blueprint/schema-component-globaldb-schema.json";
import lambda from "@site/static/schema/latest/blueprint/schema-component-lambda-schema.json";
import functionComponent from "@site/static/schema/latest/blueprint/schema-component-function-schema.json";
import lb from "@site/static/schema/latest/blueprint/schema-component-lb-schema.json";
import lbPort from "@site/static/schema/latest/blueprint/schema-component-lbport-schema.json";
import mobileapp from "@site/static/schema/latest/blueprint/schema-component-mobileapp-schema.json";
import mobilenotifier from "@site/static/schema/latest/blueprint/schema-component-mobilenotifier-schema.json";
import mobilenotifierplatform from "@site/static/schema/latest/blueprint/schema-component-mobilenotifierplatform-schema.json";
import mta from "@site/static/schema/latest/blueprint/schema-component-mta-schema.json";
import mtarule from "@site/static/schema/latest/blueprint/schema-component-mtarule-schema.json";
import network from "@site/static/schema/latest/blueprint/schema-component-network-schema.json";
import networkroute from "@site/static/schema/latest/blueprint/schema-component-networkroute-schema.json";
import networkacl from "@site/static/schema/latest/blueprint/schema-component-networkacl-schema.json";
import objectsql from "@site/static/schema/latest/blueprint/schema-component-objectsql-schema.json";
import privateservice from "@site/static/schema/latest/blueprint/schema-component-privateservice-schema.json";
import queuehost from "@site/static/schema/latest/blueprint/schema-component-queuehost-schema.json";
import router from "@site/static/schema/latest/blueprint/schema-component-router-schema.json";
import routerstaticroute from "@site/static/schema/latest/blueprint/schema-component-routerstaticroute-schema.json";
import secretstore from "@site/static/schema/latest/blueprint/schema-component-secretstore-schema.json";
import secret from "@site/static/schema/latest/blueprint/schema-component-secret-schema.json";
import serviceregistry from "@site/static/schema/latest/blueprint/schema-component-serviceregistry-schema.json";
import serviceregistryservice from "@site/static/schema/latest/blueprint/schema-component-serviceregistryservice-schema.json";
import spa from "@site/static/schema/latest/blueprint/schema-component-spa-schema.json";
import sqs from "@site/static/schema/latest/blueprint/schema-component-sqs-schema.json";
import template from "@site/static/schema/latest/blueprint/schema-component-template-schema.json";
import topic from "@site/static/schema/latest/blueprint/schema-component-topic-schema.json";
import topicsubscription from "@site/static/schema/latest/blueprint/schema-component-topicsubscription-schema.json";
import user from "@site/static/schema/latest/blueprint/schema-component-user-schema.json";
import userpool from "@site/static/schema/latest/blueprint/schema-component-userpool-schema.json";
import userpoolclient from "@site/static/schema/latest/blueprint/schema-component-userpoolclient-schema.json";
import userpoolauthprovider from "@site/static/schema/latest/blueprint/schema-component-userpoolauthprovider-schema.json";
import userpoolresource from "@site/static/schema/latest/blueprint/schema-component-userpoolresource-schema.json";

/* Layer Schema */
import accountSchema from "@site/static/schema/latest/blueprint/schema-layer-account-schema.json";
import environmentSchema from "@site/static/schema/latest/blueprint/schema-layer-environment-schema.json";
import productSchema from "@site/static/schema/latest/blueprint/schema-layer-product-schema.json";
import regionSchema from "@site/static/schema/latest/blueprint/schema-layer-region-schema.json";
import segmentSchema from "@site/static/schema/latest/blueprint/schema-layer-segment-schema.json";
import solutionSchema from "@site/static/schema/latest/blueprint/schema-layer-solution-schema.json";
import tenantSchema from "@site/static/schema/latest/blueprint/schema-layer-tenant-schema.json";

const patternPropertiesRegex = "^[A-Za-z_][A-Za-z0-9_]*$";

const schema = {
  reference: {
    AlertProfile: { data: alertProfileSchema },
    AlertRule: { data: alertRuleSchema },
    BaselineProfile: { data: baselineProfileSchema },
    Bootstrap: { data: bootstrap },
    BootstrapProfile: { data: bootstrapProfile },
    CORSProfile: { data: corsProfile },
    Category: { data: category },
    CertificateBehaviour: { data: certBehaviour },
    ComputeProvider: { data: computeProvider},
    CountryGroup: { data: countryGroup},
    DeploymentGroup: { data: deploymentGroup},
    DeploymentMode: { data: deploymentMode},
    DeploymentProfile: { data: deploymentProfile},
    IPAddressGroup: { data: ipAddrGroup},
    LogFile: { data: logFile},
    LogFileGroup: { data: logFileGroup},
    LogFileProfile: { data: logFileProfile},
    LogFilter: { data: logFilter},
    LoggingProfile: { data: loggingProfile},
    NetworkEndpointGroup: { data: networkEndpointGroup},
    NetworkProfile: { data: networkProfile},
    PlacementProfile: { data: placementProfile},
    PolicyProfile: { data: policyProfile},
    Port: { data: port},
    PortMapping: { data: portMapping},
    Processor: { data: processor},
    Region: { data: region},
    ScriptStore: { data: scriptStore},
    SecurityProfile: { data: securityProfile},
    ServiceRole: { data: serviceRole},
    Storage: { data: storage},
    TestCase: { data: testCase},
    TestProfile: { data: testProfile},
    WAFCondition: { data: wafCondition},
    WAFProfile: { data: wafProfile},
    WAFRule: { data: wafRule},
    WAFRuleGroup: { data: wafRuleGroup},
    WAFValueSet: { data: wafValueSet},
  },
  component: {
    adaptor: { data: adaptor},
    apigateway: { data: apigateway},
    apiusageplan: { data: apiusageplan},
    baseline:  { data: baseline },
    baselinedata: { data: baselinedata},
    baselinekey: { data: baselinekey },
    bastion: { data: bastion},
    cache: { data: cache},
    cdn: { data: cdn},
    cdnroute: { data: cdnroute},
    computecluster: { data: computecluster},
    configstore: { data: configstore},
    configbranch: { data: configbranch},
    containerhost: { data: containerhost},
    containerservice: { data: containerservice},
    containertask: { data: containertask },
    contenthub: { data: contenthub },
    contentnode: { data: contentnode },
    datafeed: { data: datafeed },
    datapipeline: { data: datapipeline },
    dataset: { data: dataset },
    datavolume: { data: datavolume },
    db: { data: db},
    ec2: { data: ec2},
    ecs: { data: ecs },
    service: { data: service },
    task: { data: task},
    efs: { data: efs},
    efsmount: { data: efsmount},
    es: { data: elasticsearch},
    externalnetwork: { data: externalnetwork},
    externalnetworkconnection: { data: externalnetworkconnection},
    externalservice: { data: externalservice},
    externalserviceendpoint: { data: externalserviceendpoint},
    federatedrole: { data: federatedrole},
    federatedroleassignment: { data: federatedroleassignment},
    filetransfer: { data: filetransfer},
    gateway: { data: gateway},
    gatewaydestination: { data: gatewaydestination},
    globaldb: { data: globaldb},
    lambda: { data: lambda},
    function: { data: functionComponent},
    lb: { data: lb},
    lbport: { data: lbPort},
    mobileapp: { data: mobileapp},
    mobilenotifier: { data: mobilenotifier},
    mobilenotifierplatform: { data: mobilenotifierplatform},
    mta: { data: mta},
    mtarule: { data: mtarule},
    network: { data: network},
    networkroute: { data: networkroute},
    networkacl: { data: networkacl},
    objectsql: { data: objectsql},
    privateservice: { data: privateservice},
    queuehost: { data: queuehost},
    router: { data: router},
    routerstaticroute: { data: routerstaticroute},
    secretstore: { data: secretstore},
    secret: { data: secret},
    serviceregistry: { data: serviceregistry},
    serviceregistryservice: { data: serviceregistryservice},
    s3: { data: s3},
    spa: { data: spa},
    sqs: { data: sqs},
    template: { data: template},
    topic: { data: topic},
    topicsubscription: { data: topicsubscription},
    user: { data: user},
    userpool: { data: userpool},
    userpoolclient: { data: userpoolclient},
    userpoolauthprovider: { data: userpoolauthprovider},
    userpoolresource: { data: userpoolresource},
  },
  attributeset: {
    link: { data: linkSchema },
    computeimage: { data: computeimageSchema },
    contextpath: { data: contextpathSchema },
    ecs_computeimage: { data: ecsComputeImageSchema },
    operatingsystem: { data: osSchema },
    ospatching: { data: osPatchingSchema },
    aws_computeimage: { data: awsComputeImageSchema },
    aws_ecs_computeimage: { data: awsEcsComputeImageSchema },
    aws_operatingsystem: { data: awsOsSchema },
  },
  layer: {
    account: { data: accountSchema },
    environment: { data: environmentSchema },
    product: { data: productSchema },
    region: { data: regionSchema },
    segment: { data: segmentSchema },
    solution: { data: solutionSchema },
    tenant: { data: tenantSchema },
  }
};

function getJsonSchemaData(type, instance){
  let result = (instance) ? schema[type][instance].data : schema[type].data;
  return result;
};

function getSchemaExample(data){

  var example = new Object;

  if (data["$ref"]) {
    data.type = "link-object";
  }

  if (data?.definitions) {
    example = getSchemaExample(Object.values(
      data.definitions)[0].patternProperties[patternPropertiesRegex].properties)
  } else {
    example =
      (data.patternProperties) ? { "*" : getSchemaExample(data.patternProperties[patternPropertiesRegex].properties ) }
      : (data.properties) ? getSchemaExample(data.properties)
      : (data.anyOf) ? data.anyOf.map(a => a.type).join(' or ')
      : (data.type) ? data.type
      : new Object
  }

   // process children
  if (Object.keys(example).length == 0) {
    Object.keys(data).map(attrName => {
      example[attrName] = getSchemaExample(data[attrName]);
      return example
    });

  }
  return example;
}

export {
  schema,
  getJsonSchemaData,
  getSchemaExample,
  patternPropertiesRegex,
};
export default getJsonSchemaData;
