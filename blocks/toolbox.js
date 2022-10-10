export let toolbox = {
    "kind": "categoryToolbox",
    "contents": [
        {
            "kind": "category",
            "name": "Loops",
            "contents": [
                {
                    "kind": "block",
                    "type": "controls_repeat_ext",
                    "inputs": {
                        "TIMES": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 1
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "controls_for",
                    "inputs": {
                        "FROM": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 1
                                }
                            }
                        },
                        "TO": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 10
                                }
                            }
                        },
                        "BY": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 1
                                }
                            }
                        },
                    }
                }
            ]
        },
        {
          "kind":"category",
          "name":"Logic",
          "contents":[
              {
                  "kind": "block",
                  "type": "logic_compare"
              },
              {
                  "kind":"block",
                  "type":"controls_if"
              }
          ]
        },
        {
          "kind":"category",
          "name":"Math",
          "contents":[
              {
                  "kind": "block",
                  "type": "math_number"
              },
              {
                  "kind": "block",
                  "type": "math_arithmetic"
              },
              {
                  "kind": "block",
                  "type": "math_modulo"
              },
              {
                  "kind":"block",
                  "type":"math_random_int",
                  "inputs": {
                      "FROM": {
                          "block": {
                              "type": "math_number",
                              "fields": {
                                  "NUM": 1
                              }
                          }
                      },
                      "TO": {
                          "block": {
                              "type": "math_number",
                              "fields": {
                                  "NUM": 100
                              }
                          }
                      }
                  }
              }
          ]
        },
        {
            "kind":"category",
            "name":"Drawing",
            "contents": [
                {
                    "kind":"block",
                    "type":"moveForward"
                },
                {
                    "kind":"block",
                    "type":"createSphere",
                    "inputs": {
                        "DIAMETER": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 1
                                }
                            }
                        },
                        "X": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 1
                                }
                            }
                        },
                        "Y": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 1
                                }
                            }
                        }
                    }
                }
            ]
        },
        {
            "kind": "category",
            "name": "Variables",
            "custom": "VARIABLE"
        },
        {
            "kind": "category",
            "name": "Functions",
            "custom": "PROCEDURE"
        }
    ]
};