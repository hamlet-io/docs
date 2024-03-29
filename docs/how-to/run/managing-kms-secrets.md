---
sidebar_label: Manage AWS KMS Secrets
title: Manage AWS KMS Secrets
---

By default, the AWS plugin for hamlet manages all secret data through AWS Key Management Service (KMS) encryption. The service encrypts content and returns a ciphertext binary object with details of the key that encrypted the input. If you have the appropriate permissions in AWS to access the key listed in the content then you can decrypt the content.

Using some encoding we can easily store these encrypted files within the CMDB and pass them between components or share them in the code repository. If someone gets the encrypted value they still need access to your AWS infrastructure to decrypt the key.

This how-to guide will show you how to manage secret data in hamlet using AWS KMS.

## Baseline Encryption Key

When you want to provide your own secrets, API keys, super user credentials etc. you use this key to encrypt the secret for each segment you want to use the secret in. Sometimes this will create duplication across your deployments, but the main goal here is to encourage you to use distinct secrets for each segment so you can reduce the risk of exposing your production environment credentials.

:::info
If you don't have an AWS hamlet deployment available and would like to try this yourself, head to the getting started guide and perform the steps up to the [environment bootstrap](/getting-started/aws-serverless/deploy-baseline/environment-bootstrap). This will create the same resources that we are working with.
:::

:::note
If you have multiple environments or segments you will need to individually encrypt the secret for each environment/segment to ensure the right key is being used
:::

## Encrypting a Setting

This will take you through encrypting a setting value. This is commonly used for passwords or API keys for external services.

1. We have been asked to provide an environment variable to an app with the name `API_PASSWORD` and value `password123`, with the value encrypted so that it can be found in our CMDB.
1. Set the context to the integration environment within your CMDB.

    ```bash
    cd myapp/config/solutionsv2/integration/default/
    ```

1. Run the following command to encrypt the secret with KMS and return the encrypted value as a base64 encoded string:

    ```bash
    hamlet manage crypto -e -t 'password123'
    ```

    ```terminal
    (Info) Generating blueprint to find details...
    AQICAHhtWZwTV2PEnKTflR+IKLu5C08kH/8QlJVDUmCccI5lBQE3efOsKfYi8CoUtAAAAajBoBgkqhkiG9w0BBwagWzBZAgEAMFQGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMdNRaIq7rxsFYMtrgAgEQgCf4MfRU/0D597b9OEUpOgKf3eAUwm6GUmTcYVJKJC40vMQmQu0NqKI=
    ```

1. In your solution file add the setting to your component:

    ```json
    {
        "Tiers" : {
            "app" : {
                "lambda" : {
                    "Type" : "lambda",
                    "Settings" : {
                        "API_PASSWORD" : {
                            "Value" : "kms+base64:AQICAHhtWZwTV2PEnKTflR+IKLu5C08kH/8QlJVDUmCccI5lBQE3efOsKfYi8CoUtAAAAajBoBgkqhkiG9w0BBwagWzBZAgEAMFQGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMdNRaIq7rxsFYMtrgAgEQgCf4MfRU/0D597b9OEUpOgKf3eAUwm6GUmTcYVJKJC40vMQmQu0NqKI="
                        }
                    }
                }
            }
        }
    }
    ```

1. This will provide the secret to the component as an environment variable. Your application code will need to be able to run the KMS decryption as part of the start process of the app. In this case we've added a prefix of `kms+base64:` to tell the application that the value is encrypted and base64 encoded.

## Decrypting a Setting

This will take you through decrypting a setting value that has already been encrypted.

1. We have an issue with the application and have been asked to provide the API_PASSWORD from our Lambda app to make sure it's correct.
1. Set the context to the integration environment.

    ```bash
    cd myapp/config/solutionsv2/integration/default/
    ```

1. Find the encrypted secret value in your settings file and copy the value with any prefixes used for the application removed.
1. Run the following command to decrypt the value. The secret value will be returned:

    ```bash
    hamlet --account acct01 manage crypto -b -v -d -t 'AQICAHhtWZwTV2PEnKTflR+IKLu5C08kH/8QlJVDUmCccI5lBQESFDLqBt3deOsKfYi8CoUtAAAAajBoBZAgEAMFQGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMdNRaIq7rxsFYMtrgAgEQgCf4MfRU/0D597b9OEUpOgKf3eAUwm6GUmTcBVHJKJC40vMQmQu0NqKI='
    ```

    ```terminal
    password123
    ```

## Decrypting an encrypted file

This will take you through decrypting the default SSH key that is generated as part of a hamlet baseline component deployment.

1. In a terminal window head to your product CMDB and from the root of the CMDB head to infrastructure/operations.
1. Run a tree on this directory to see what it includes.

    :::note
    Make sure to include -a on the tree command. The SSH keys are hidden by default.
    :::

    ```bash
    tree -a
    .
    └── integration
        ├── .gitignore
        └── default
            ├── .aws-acct01-ap-southeast-2-ssh-crt.pem
            ├── .aws-acct01-ap-southeast-2-ssh-prv.pem
            └── .gitignore

    2 directories, 4 files
    ```

1. Here you can see we have two files, a crt.pem file which contains the public key -

    ```bash
    cat integration/default/.aws-acct01-ap-southeast-2-ssh-crt.pem

    -----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFBBOCAQ8AMIIBCgKCAQEAyU2s+V0rfaybrcwPaFN5
    pRVh6c46aqtLOzU/azyRZEEi4/i54LRXfJevn51hmbAyYJRSodG0lc9aDMlKTKMX
    FeOkff9XZPJx/Liw/+9NSUdJ/4fUgKTE15Rdl+lKl37zihRLERvaHNBSNprs7MCT
    oaYBGys/2GeUfqQnqcNJPs0O1dzaltVIK0qdCWhSy9nKMGhhMgz3E856Co3vJESE
    KZjD583Knu8p2nxDlLgupPWuIPQauo2uXyKanjYCCBbNqFUaC0R6Le8B6PQ9jAk5
    QnTv2e27vB8Fut40Ed+PBk7o1guU9Izfw8zYn2M7XMG2afDaoVWMYMcB/z5mR2B8
    rwIDAQAB
    -----END PUBLIC KEY-----
    ```

1. and the Private key.

    ```bash
    cat integration/default/.aws-acct01-ap-southeast-2-ssh-prv.pem

    AQICAHhFvZDFA0caD9koadjq8pQo7vBss8bCQCQDg+veHXhcOQGbJtD+xl4hYrvhcVfPTRbSyvz1InJ14OoQzU8O4c0Ac7JsnckeRRYsNd0eClVEb/6+8tS3lJ5yviTODLD9bup8rDc1VasmME0izeEcUijRf7+hgoza09DVqmTIVdI+Bz/f7ej9ft1O3aY5+d+T297Kz363KIiS7srlYQzT9l0y0KUNhLFPAQyOGPE1oqpOVpPACzt+e5DlHqslENj3OyfoSSl7eXSplhLKbZlg+Xh/kL9sdhGcM3eYFC9JNDemEk/HpG8YfR4y1gTqCWnK6/N52LUyHtuvrUR8g+HlBoH5F3URFvUzA/S7tOmH3rdx0SLzf1Vqy5QG56YOe2M0VATsoOn09/jO+i5i11YoiG0Hn5abqSJYDfUXCa5LyZd8=
    ```

    If you've seen SSH private keys before they usually start with:

    ```bash
    -----BEGIN RSA PRIVATE KEY-----
    ```

    This key has been encrypted by hamlet using the AWS KMS service, so we need to decrypt the file.

1. First get the full path to the KMS key:

    ```bash
    realpath integration/default/.aws-acct01-ap-southeast-2-ssh-prv.pem
    ```

    This will return the full path to the file. Copy this or note it down.

1. Set your CMDB context by changing into the config directory.

    ```bash
    cd config/solutionsv2/integration/default
    ```

1. Run the following command to decrypt the file:

    ```bash
    hamlet manage file-crypto -d -u -f <full path to private key>
    ```

1. hamlet will decrypt the key and save a copy in the same directory with `.plaintext` appended to the file name.

    ```tree
    solutionsv2/integration/default
    ➜ cd ../../../../infrastructure/operations/

    myapp/infrastructure/operations
    ➜ tree -a
    .
    └── integration
        ├── .gitignore
        └── default
            ├── .aws-acct01-ap-southeast-2-ssh-crt.pem
            ├── .aws-acct01-ap-southeast-2-ssh-prv.pem
            ├── .aws-acct01-ap-southeast-2-ssh-prv.pem.decrypted
            └── .gitignore

    2 directories, 5 files
    ```

1. You can now access the private key and use it to SSH into your ec2 instances.

:::warning
When we generate the private key a .gitignore is added to ignore any files ending in decrypted. Make sure that you don't include the decrypted files in your git commits.
:::

## Encrypting a secret file

We have now been provided a certificate file to access another service. We need to encrypt it and store it in the CMDB so that it can be accessed by our application.

1. Our Lambda function looks like this in our solution:

    ```json
    {
        "Tiers": {
            "app": {
                "Components": {
                    "lambda" : {
                        "Type" : "lambda",
                        "Functions" : {
                            "run" : {
                                "Image" : {
                                    "Source" : "extension"
                                },
                                "Handler" : "index.handler",
                                "RunTime" : "python3.8",
                                "Settings" : {
                                    "API_PASSWORD" : {
                                        "Value" : "kms+base64:AQICAHhtWZwTV2PEnKTflR+IKLu5C08kH/8QlJVDUmCccI5lBQESFDLqBt3deOsKfYi8CoUtAAAAajBoBgkqhkiG9w0BBwagWzBZAgEAMFQGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMdNRaIq7rxsFYMtrgAgEQgCf4MfRU/0D597b9OEUpOgKf3eAUwm6GUmTcYVJKJC40vMQmQu0NqKI="
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    ```

1. Set your CMDB context by changing into the config directory.

    ```bash
    cd config/solutionsv2/integration/default
    ```

1. Get a Setting namespace where the file will be saved in the CMDB.

    ```bash
    hamlet component describe-occurrence -n application-lambda-run-function setting-namespaces
    ```

    ```terminal
    [
        {
            "Key": "application-lambda-run",
            "Match": "partial"
        },
    ...
    ```

1. Create a directory in the settings configuration for this namespace. asFile tells hamlet that these are files that should be staged in an object store.

    ```bash
    mkdir -p <product cmdb>/config/settings/integration/default/application-lambda-run/asFile/
    ```

1. In the new file generate a random key that will meet the application needs:

    ```bash
    echo "${RANDOM}" | sha1sum > <product cmdb>/config/settings/integration/default/application-lambda-run/asFile/random.key
    ```

1. Set your CMDB context by changing into the config directory.

    ```bash
    cd config/solutionsv2/integration/default
    ```

1. Encrypt the file using the following command:

    ```bash
    hamlet manage file-crypto -e -u -f '<product cmdb>/config/settings/integration/default/application-lambda-run/asFile/random.key'
    ```

1. The contents of the file will be encrypted and the file contents replaced with the encrypted content.
