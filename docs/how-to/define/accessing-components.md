---
sidebar_label: Access Other Components
title: Accessing Other Components
---

hamlet works on the concept of a solution, a collection of components which work together to deliver your application. For the components to work together they need to know each other exist, how to connect to them and have the appropriate permissions to access the component. hamlet uses Links as the standard approach to providing access between components in a solution.

In this guide we will cover the link between a standard client and database connection using the lambda and globaldb component on AWS.

For this how-to we will be using the following solution

```json
{
    "Solution" : {
        "Id": "solution"
    },
    "Tiers" : {
        "app" : {
            "Components" : {
                "apifunction" : {
                    "Type" : "lambda",
                    "deployment:Unit" : "api",
                    "Functions" : {
                        "process_order" : {
                            "RunTime" : "python3.8",
                            "Memory" : 128,
                            "Handler" : "lambda.handler",
                            "VPCAccess" : false
                        },
                        "create_user" : {
                            "RunTime" : "python3.8",
                            "Memory" : 128,
                            "Handler" : "lambda.handler",
                            "VPCAccess" : false
                        }
                    }
                }
            }
        },
        "db" : {
            "Components" : {
                "usertable" : {
                    "Type" : "globaldb",
                    "deployment:Unit" : "usertable",
                    "PrimaryKey" : "id"
                }
            }
        }
    }
}
```

Before we start lets look at the CloudFormation Deployment for the process_order lambda function

```bash
hamlet deploy create-deployments -u api
```

```json
{
    "Resources" : {
        "lambdaXappXapifunctionXprocessXorder": {
            "Type": "AWS::Lambda::Function",
            "Properties": {
                "Role": "arn:aws:iam::123456789012:role/managedPolicyXuserXappXapiuserbaseXlinksXarn",
                "FunctionName": "myapi-integration-application-apifunction-process_order",
                "MemorySize": 128,
                "Runtime": "python3.8",
                "Description": "myapi-integration-application-apifunction-process_order",
                "Handler": "lambda.handler",
                "Code": {
                    "S3Bucket": "account-registry-7w3vt2eh6d",
                    "S3Key": "lambda/myapi/application-apifunction-process_order/abc123/lambda.zip"
                }
            }
        }
    }
}
```

The lambda function is pretty simple, the code is in S3, its using python and it has 128mb of memory

At the moment this solution has a lambda component and a globadb component, but they don't know anything about each other. There are two functions in the lambda component, process_order needs read access to the usertable and the create_user table needs read/write access to the usertable.

1. The first part of the configuration is to link the functions to the user table

    ```json
    {
        "Solution" : {
            "Id": "solution"
        },
        "Tiers" : {
            "app" : {
                "Components" : {
                    "apifunction" : {
                        "Type" : "lambda",
                        "deployment:Unit" : "api",
                        "Functions" : {
                            "process_order" : {
                                "RunTime" : "python3.8",
                                "Memory" : 128,
                                "Handler" : "lambda.handler",
                                "VPCAccess" : false,
                                "Links" : {
                                    "USER_TABLE" : {
                                        "Tier" : "db",
                                        "Component" : "usertable"
                                    }
                                }
                            },
                            "create_user" : {
                                "RunTime" : "python3.8",
                                "Memory" : 128,
                                "Handler" : "lambda.handler",
                                "VPCAccess" : false,
                                "Links" : {
                                    "USER_TABLE" : {
                                        "Tier" : "db",
                                        "Component" : "usertable"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "db" : {
                "Components" : {
                    "usertable" : {
                        "Type" : "globaldb",
                        "deployment:Unit" : "usertable",
                        "PrimaryKey" : "id"
                    }
                }
            }
        }
    }
    ```

1. Generate the api template again and see if anything has changed

    ```json
    {
    "Resources" : {
        "lambdaXappXapifunctionXprocessXorder": {
            "Type": "AWS::Lambda::Function",
            "Properties": {
                "Role": "arn:aws:iam::123456789012:role/managedPolicyXuserXappXapiuserbaseXlinksXarn",
                "FunctionName": "myapi-integration-application-apifunction-process_order",
                "MemorySize": 128,
                "Runtime": "python3.8",
                "Description": "myapi-integration-application-apifunction-process_order",
                "Handler": "lambda.handler",
                "Environment": {
                    "Variables": {
                        "USERS_TABLE_KEY": "id",
                        "USERS_TABLE_ARN": "arn:aws:iam::123456789012:mock/dynamoTableXdbXusertableXarn",
                        "USERS_TABLE_NAME": "##MockOutputXdynamoTableXdbXusertableX##"
                    }
                },
                "Code": {
                "S3Bucket": "account-registry-7w3vt2eh6d",
                "S3Key": "lambda/myapi/application-apifunction-process_order/8f194db4f6ed2b826387112df144f188451ba6db/lambda.zip"
                }
            }
        }
    }
    ```

    The process_order function now has 3 environment variables defined which set the ARN, PrimaryKey and Name of the usertable globaldb. Adding the link between the components updated the settings for the process_order occurrence to include details about the table which were then converted to environment variables.

1. Now that the lambda is passing details of the globaldb to the application run time environment we need to make sure the permissions align with the requirements. The process_order function only needs read only access to the globaldb. The permissions can also be configured using links, through the Role property.

    To see the roles that a component offers in links we can look at occurrence

    ```bash
    hamlet component describe-occurrence -n database-usertable-globaldb -q 'State.Roles'
    ```

    ```json
    {
    "Outbound": {
        "all": [
            {
                "Action": [
                    "dynamodb:BatchGetItem",
                    "dynamodb:DescribeTable",
                    "dynamodb:GetItem",
                    "dynamodb:DescribeTimeToLive",
                    "dynamodb:ListTagsOfResource"
                ],
                "Resource": {
                    "Fn::GetAtt": [
                        "dynamoTableXdbXusertable",
                        "Arn"
                    ]
                },
                "Effect": "Allow"
            },
            {
                "Action": [
                    "dynamodb:BatchWriteItem",
                    "dynamodb:PutItem",
                    "dynamodb:UpdateItem",
                    "dynamodb:TagResource",
                    "dynamodb:UntagResource"
                ],
                "Resource": {
                    "Fn::GetAtt": [
                        "dynamoTableXdbXusertable",
                        "Arn"
                    ]
                },
                "Effect": "Allow"
            },
            {
                "Action": [
                    "dynamodb:DeleteItem"
                ],
                "Resource": {
                    "Fn::GetAtt": [
                        "dynamoTableXdbXusertable",
                        "Arn"
                    ]
                },
                "Effect": "Allow"
            },
            {
                "Action": [
                    "dynamodb:Query"
                ],
                "Resource": {
                    "Fn::GetAtt": [
                        "dynamoTableXdbXusertable",
                        "Arn"
                    ]
                },
                "Effect": "Allow"
            },
            {
                "Action": [
                    "dynamodb:Scan"
                ],
                "Resource": {
                    "Fn::GetAtt": [
                        "dynamoTableXdbXusertable",
                        "Arn"
                    ]
                },
                "Effect": "Allow"
            }
        ],
        "default": "consume",
        "stream": [],
        "consume": [
            {
                "Action": [
                    "dynamodb:BatchGetItem",
                    "dynamodb:DescribeTable",
                    "dynamodb:GetItem",
                    "dynamodb:DescribeTimeToLive",
                    "dynamodb:ListTagsOfResource"
                ],
                "Resource": {
                    "Fn::GetAtt": [
                        "dynamoTableXdbXusertable",
                        "Arn"
                    ]
                },
                "Effect": "Allow"
            },
            {
                "Action": [
                    "dynamodb:Query"
                ],
                "Resource": {
                    "Fn::GetAtt": [
                        "dynamoTableXdbXusertable",
                        "Arn"
                    ]
                },
                "Effect": "Allow"
            },
            {
                "Action": [
                    "dynamodb:Scan"
                ],
                "Resource": {
                    "Fn::GetAtt": [
                        "dynamoTableXdbXusertable",
                        "Arn"
                    ]
                },
                "Effect": "Allow"
            }
        ],
        "produce": [
            {
                "Action": [
                    "dynamodb:BatchGetItem",
                    "dynamodb:DescribeTable",
                    "dynamodb:GetItem",
                    "dynamodb:DescribeTimeToLive",
                    "dynamodb:ListTagsOfResource"
                ],
                "Resource": {
                    "Fn::GetAtt": [
                        "dynamoTableXdbXusertable",
                        "Arn"
                    ]
                },
                "Effect": "Allow"
            },
            {
                "Action": [
                    "dynamodb:BatchWriteItem",
                    "dynamodb:PutItem",
                    "dynamodb:UpdateItem",
                    "dynamodb:TagResource",
                    "dynamodb:UntagResource"
                ],
                "Resource": {
                    "Fn::GetAtt": [
                        "dynamoTableXdbXusertable",
                        "Arn"
                    ]
                },
                "Effect": "Allow"
            },
            {
                "Action": [
                    "dynamodb:Query"
                ],
                "Resource": {
                    "Fn::GetAtt": [
                        "dynamoTableXdbXusertable",
                        "Arn"
                    ]
                },
                "Effect": "Allow"
            },
            {
                "Action": [
                    "dynamodb:Scan"
                ],
                "Resource": {
                    "Fn::GetAtt": [
                        "dynamoTableXdbXusertable",
                        "Arn"
                    ]
                },
                "Effect": "Allow"
            }
        ]
    },
    "Inbound": {}
    }
    ```

    So the global db offers 4 outbound roles

    - all - full read/write ( get, delete, put, scan, query)
    - consume - read access ( get, scan, query )
    - produce - read/write ( get, put, scan, query)
    - stream - no permissions

    Another role is listed under outbound called `default` this is a special role value that maps to the default role when a role isn't defined on the link. In this case the default role is consume. So the role for process_order function doesn't need to be updated as it only has read access to the global db.

1. The create_user function needs write access to the global db. Update the solution to include the role

    ```json
    {
        "Solution" : {
            "Id": "solution"
        },
        "Tiers" : {
            "app" : {
                "Components" : {
                    "apifunction" : {
                        "Type" : "lambda",
                        "deployment:Unit" : "api",
                        "Functions" : {
                            "process_order" : {
                                "RunTime" : "python3.8",
                                "Memory" : 128,
                                "Handler" : "lambda.handler",
                                "VPCAccess" : false,
                                "Links" : {
                                    "USER_TABLE" : {
                                        "Tier" : "db",
                                        "Component" : "usertable"
                                    }
                                }
                            },
                            "create_user" : {
                                "RunTime" : "python3.8",
                                "Memory" : 128,
                                "Handler" : "lambda.handler",
                                "VPCAccess" : false,
                                "Links" : {
                                    "USER_TABLE" : {
                                        "Tier" : "db",
                                        "Component" : "usertable",
                                        "Role" : "all"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "db" : {
                "Components" : {
                    "usertable" : {
                        "Type" : "globaldb",
                        "deployment:Unit" : "usertable",
                        "PrimaryKey" : "id"
                    }
                }
            }
        }
    }
    ```

    Now when the IAM role is created for create_user it will be configured with the all role from the global db, the process_order role will get the consume role from the global db.

This is an example of how you can use links to access other components in your solution and to control the permissions that one component has on another. It also highlights the integration between Links and Settings when it comes to providing configuration to your application run time.
