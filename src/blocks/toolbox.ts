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
                    "type": "skybox"
                },
                {
                    "kind": "block",
                    "type": "ground",
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
                        },
                        "MATERIAL": {
                            "shadow": {
                                "type": "none",
                                "fields": {
                                    "NUM": "NONE"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "createShape",
                    "inputs": {
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
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "move",
                    "inputs": {
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
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "size",
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
            "name": "Shapes",
            "contents": [
                {
                    "kind": "block",
                    "type": "sphere",
                    "inputs": {
                        "SIZE": {
                            "block": {
                                "type": "size",
                                "inputs": {
                                    "X": {
                                        "shadow": {
                                            "type": "math_number",
                                            "fields": {
                                                "NUM": 1
                                            }
                                        }
                                    },
                                    "Y": {
                                        "shadow": {
                                            "type": "math_number",
                                            "fields": {
                                                "NUM": 1
                                            }
                                        }
                                    },
                                    "Z": {
                                        "shadow": {
                                            "type": "math_number",
                                            "fields": {
                                                "NUM": 1
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "MATERIAL": {
                            "shadow": {
                                "type": "none",
                                "fields": {
                                    "NUM": "NONE"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "box",
                    "inputs": {
                        "SIZE": {
                            "block": {
                                "type": "size",
                                "inputs": {
                                    "X": {
                                        "shadow": {
                                            "type": "math_number",
                                            "fields": {
                                                "NUM": 1
                                            }
                                        }
                                    },
                                    "Y": {
                                        "shadow": {
                                            "type": "math_number",
                                            "fields": {
                                                "NUM": 1
                                            }
                                        }
                                    },
                                    "Z": {
                                        "shadow": {
                                            "type": "math_number",
                                            "fields": {
                                                "NUM": 1
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "MATERIAL": {
                            "shadow": {
                                "type": "none",
                                "fields": {
                                    "NUM": "NONE"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "merge"
                }
            ]
        },
        {
            "kind": "category",
            "name": "Materials",
            "contents": [
                {
                    "kind": "block",
                    "type": "none"
                },
                {
                    "kind": "block",
                    "type": "earth"
                },
                {
                    "kind": "block",
                    "type": "building"
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