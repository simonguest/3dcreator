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
            "kind": "category",
            "name": "Logic",
            "contents": [
                {
                    "kind": "block",
                    "type": "logic_compare"
                },
                {
                    "kind": "block",
                    "type": "controls_if"
                }
            ]
        },
        {
            "kind": "category",
            "name": "Math",
            "contents": [
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
                    "kind": "block",
                    "type": "math_random_int",
                    "inputs": {
                        "FROM": {
                            "shadow": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 1
                                }
                            }
                        },
                        "TO": {
                            "shadow": {
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
            "kind": "category",
            "name": "Coordinates",
            "contents": [
                {
                    "kind": "block",
                    "type": "coordinates",
                    "inputs": {
                        "X": {
                            "shadow": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 0
                                }
                            }
                        },
                        "Y": {
                            "shadow": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 0
                                }
                            }
                        },
                        "Z": {
                            "shadow": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 0
                                }
                            }
                        }
                    }
                }
            ]
        },
        {
            "kind": "category",
            "name": "World",
            "contents": [
                {
                    "kind": "block",
                    "type": "createGround",
                    "inputs": {
                        "WIDTH": {
                            "shadow": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 6
                                }
                            }
                        },
                        "LENGTH": {
                            "shadow": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 6
                                }
                            }
                        }
                    }
                }
            ]
        },
        {
            "kind": "category",
            "name": "Objects",
            "contents": [
                {
                    "kind": "block",
                    "type": "createSphere",
                    "inputs": {
                        "DIAMETER": {
                            "shadow": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 1
                                }
                            },
                        },
                        "COORDS": {
                            "block": {
                                "type": "coordinates",
                                "inputs": {
                                    "X": {
                                        "shadow": {
                                            "type": "math_number",
                                            "fields": {
                                                "NUM": 0
                                            }
                                        }
                                    },
                                    "Y": {
                                        "shadow": {
                                            "type": "math_number",
                                            "fields": {
                                                "NUM": 0
                                            }
                                        }
                                    },
                                    "Z": {
                                        "shadow": {
                                            "type": "math_number",
                                            "fields": {
                                                "NUM": 0
                                            }
                                        }
                                    }
                                }
                            },
                        }
                    }
                }
            ]
        },
        {
            "kind": "category",
            "name": "Materials",
            "contents": [
                {
                    "kind": "block",
                    "type": "setMaterial"
                },
                {
                    "kind": "block",
                    "type": "none"
                },
                {
                    "kind": "block",
                    "type": "earth"
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