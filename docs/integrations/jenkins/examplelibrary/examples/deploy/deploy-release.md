---
sidebar_label: deploy
title: Deploy Release Pipeline
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


// Deploy a release which has been prepared for the environment
// Either specify the release units as an array or provide an input block once the product properties have been loaded


## Triggers
This pipeline is intended to be called by the ['Build' pipeline](../build/single) for Continuous Deployment into the first environment. 

If deployment across [Segments](../../../../../foundations/terminology#segment) is required, an additional parameter could be created in the 'Build' pipeline to supply the Segment value alongside the other parameters.

## Parameters
This pipeline accepts **DEPLOYMENT_UNITS** (extendedChoice), **RELEASE_IDENTIFIER** (string) and **MODE** (choice) parameters. Choices will be populated by the configuration of the [`dotproperties`](../../../pipelines/dotproperties) file.

## Stages

### Setup
Loads environment variables from the Hamlet [`dotproperties`](../../../pipelines/dotproperties) file.

### Update Build Refs
Stores the hash value of the "Git Commit" in the current Environment/Segment/DeploymentUnit's `build.json` within the Hamlet CMDB.

### Deploy
Creates and deploys all application-level component templates from the list of Deployment Units supplied as a parameter. Tags the CMDB repository with the deployment reference and commits the generated application templates back to the CMDB.

### Post Job
After running, this pipeline will notify a defined slack channel of either success or failure.

## Scripts
This example uses groovy scripts from the [jenkins-shared-library](../../../scriptlibrary/index).

## Example
```groovy
#!groovy

def releaseUnits = [
    '<release units as a list>'
]

pipeline {
    agent {
        label '<hamlet agent lable>'
    }

    options {
        timestamps ()
        buildDiscarder(
            logRotator(
                daysToKeepStr: '14'
            )
        )
        durabilityHint('PERFORMANCE_OPTIMIZED')
        parallelsAlwaysFailFast()
        checkoutToSubdirectory '.hamlet/product/'
    }

    parameters {
        extendedChoice(
            name: 'DEPLOYMENT_UNITS',
            description: 'Units to be updated as part of the release preparation. For those units where code references are to be updated, append the detail after the affected unit',
            multiSelectDelimiter: ',',
            type: 'PT_CHECKBOX',
            value: "${ releaseUnits.join(",") }",
            visibleItemCount: 10
        )

        string(
            name: 'RELEASE_IDENTIFIER',
            defaultValue: '',
            description: 'Identifier for the release. If not provided, the current build number will be used'
        )

        choice(
            name: 'MODE',
            choices: ['update', 'stop', 'stopstart'],
            description: 'The deployment mode to use for the deployment'
        )
    }

    environment {
        properties_file = '.hamlet/product/<product properties file>'
        slack_channel = '<slack channel>'

        ENVIRONMENT = '<ENVIRONMENT>'
        SEGMENT = '<SEGMENT>'
        DEPLOYMENT_UNITS = "${params["DEPLOYMENT_UNITS"]}"
        RELEASE_INDETIFIER = "${params["RELEASE_INDETIFIER"]}"
        MODE = "${params["MODE"]}"
    }

    stages{
        stage('Setup') {
            steps {
                // Load in Properties files
                script {
                    def productProperties = readProperties interpolate: true, file: "${env.properties_file}";
                    productProperties.each{ k, v -> env["${k}"] ="${v}" }

                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''#!/bin/bash
                    ${AUTOMATION_BASE_DIR}/setContext.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/validateDeployReleaseParameters.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/constructTree.sh -c ${RELEASE_TAG} -i ${RELEASE_TAG}
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/deploySetup.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/deployRelease.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                script {
                    currentBuild.description = "Release Id: ${env.RELEASE_IDENTIFIER}"
                }

            }
        }
    }

    post {
        success {
            slackSend (
                message: "Deploy Completed - ${BUILD_DISPLAY_NAME} (<${BUILD_URL}|Open>)\n Environment: ${env.ENVIRONMENT} - Segment: ${env.SEGMENT} \n DeploymentUnits: ${params.DEPLOYMENT_UNITS}",
                channel: "${env["slack_channel"]}",
                color: "#50C878"
            )
        }

        failure {
            slackSend (
                message: "Deploy Failed - ${BUILD_DISPLAY_NAME} (<${BUILD_URL}|Open>)\n Environment: ${env.ENVIRONMENT} - Segment: ${env.SEGMENT} \n DeploymentUnits: ${params.DEPLOYMENT_UNITS}",
                channel: "${env["slack_channel"]}",
                color: "#D20F2A"
            )
        }
    }

}
```