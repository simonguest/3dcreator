export let toolbox = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Loops",
      contents: [
        {
          kind: "block",
          type: "controls_repeat_ext",
          inputs: {
            TIMES: {
              block: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "controls_for",
          inputs: {
            FROM: {
              block: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            TO: {
              block: {
                type: "math_number",
                fields: {
                  NUM: 10,
                },
              },
            },
            BY: {
              block: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
          },
        },
      ],
    },
    {
      kind: "category",
      name: "Logic",
      contents: [
        {
          kind: "block",
          type: "logic_compare",
        },
        {
          kind: "block",
          type: "controls_if",
        },
      ],
    },
    {
      kind: "category",
      name: "Math",
      contents: [
        {
          kind: "block",
          type: "math_number",
        },
        {
          kind: "block",
          type: "math_arithmetic",
          inputs: {
            A: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            B: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_modulo",
          inputs: {
            DIVIDEND: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 100,
                },
              },
            },
            DIVISOR: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 5,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_random_int",
          inputs: {
            FROM: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            TO: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 100,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_single",
          inputs: {
            NUM: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 9,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_trig",
          inputs: {
            NUM: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 45,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_constant",
        },
        {
          kind: "block",
          type: "math_number_property",
          inputs: {
            NUMBER_TO_CHECK: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 10,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_round",
          inputs: {
            NUM: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1.3,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_constrain",
          inputs: {
            VALUE: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 50,
                },
              },
            },
            LOW: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 5,
                },
              },
            },
            HIGH: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 100,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "debug",
        },
      ],
    },
    {
      kind: "category",
      name: "World",
      contents: [
        {
          kind: "block",
          type: "skybox",
        },
        {
          kind: "block",
          type: "ground",
          inputs: {
            WIDTH: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 6,
                },
              },
            },
            LENGTH: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 6,
                },
              },
            },
            TILESIZE: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 6,
                },
              },
            },
            MATERIAL: {
              shadow: {
                type: "none",
              },
            },
          },
        },
        {
          kind: "block",
          type: "createShape",
          inputs: {
            COORDS: {
              block: {
                type: "coordinates",
                inputs: {
                  X: {
                    shadow: {
                      type: "math_number",
                      fields: {
                        NUM: 0,
                      },
                    },
                  },
                  Y: {
                    shadow: {
                      type: "math_number",
                      fields: {
                        NUM: 0,
                      },
                    },
                  },
                  Z: {
                    shadow: {
                      type: "math_number",
                      fields: {
                        NUM: 0,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "createShapeAs",
          inputs: {
            COORDS: {
              block: {
                type: "coordinates",
                inputs: {
                  X: {
                    shadow: {
                      type: "math_number",
                      fields: {
                        NUM: 0,
                      },
                    },
                  },
                  Y: {
                    shadow: {
                      type: "math_number",
                      fields: {
                        NUM: 0,
                      },
                    },
                  },
                  Z: {
                    shadow: {
                      type: "math_number",
                      fields: {
                        NUM: 0,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "move",
          inputs: {
            COORDS: {
              block: {
                type: "coordinates",
                inputs: {
                  X: {
                    shadow: {
                      type: "math_number",
                      fields: {
                        NUM: 0,
                      },
                    },
                  },
                  Y: {
                    shadow: {
                      type: "math_number",
                      fields: {
                        NUM: 0,
                      },
                    },
                  },
                  Z: {
                    shadow: {
                      type: "math_number",
                      fields: {
                        NUM: 0,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "moveAlong",
          inputs: {
            STEPS: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "rotate",
          inputs: {
            DEGREES: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 45,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "clone",
          inputs: {
            COORDS: {
              block: {
                type: "coordinates",
                inputs: {
                  X: {
                    shadow: {
                      type: "math_number",
                      fields: {
                        NUM: 0,
                      },
                    },
                  },
                  Y: {
                    shadow: {
                      type: "math_number",
                      fields: {
                        NUM: 0,
                      },
                    },
                  },
                  Z: {
                    shadow: {
                      type: "math_number",
                      fields: {
                        NUM: 0,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "remove",
        },
        {
          kind: "block",
          type: "merge",
        },
        {
          kind: "block",
          type: "coordinates",
          inputs: {
            X: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 0,
                },
              },
            },
            Y: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 0,
                },
              },
            },
            Z: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 0,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "getPosition",
        },
      ],
    },
    {
      kind: "category",
      name: "Shapes",
      contents: [
        {
          kind: "block",
          type: "sphere",
          inputs: {
            L: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            H: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            W: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            MATERIAL: {
              shadow: {
                type: "none",
              },
            },
          },
        },
        {
          kind: "block",
          type: "box",
          inputs: {
            H: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            W: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            L: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            MATERIAL: {
              shadow: {
                type: "none",
              },
            },
          },
        },
        {
          kind: "block",
          type: "wall",
          inputs: {
            H: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 6,
                },
              },
            },
            W: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 6,
                },
              },
            },
            S: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            MATERIAL: {
              shadow: {
                type: "none",
              },
            },
          },
        },
        {
          kind: "block",
          type: "cylinder",
          inputs: {
            H: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            D: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            MATERIAL: {
              shadow: {
                type: "none",
              },
            },
          },
        },
        {
          kind: "block",
          type: "capsule",
          inputs: {
            H: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            D: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 0.5,
                },
              },
            },
            MATERIAL: {
              shadow: {
                type: "none",
              },
            },
          },
        },
      ],
    },
    {
      kind: "category",
      name: "Materials",
      contents: [
        {
          kind: "block",
          type: "none",
        },
        {
          kind: "block",
          type: "matte",
        },
        {
          kind: "block",
          type: "glass",
        },
        {
          kind: "block",
          type: "bricks",
        },
        {
          kind: "block",
          type: "carpet",
        },
        {
          kind: "block",
          type: "chip",
        },
        {
          kind: "block",
          type: "fabric",
        },
        {
          kind: "block",
          type: "grass",
        },
        {
          kind: "block",
          type: "marble",
        },
        { 
          kind: "block",
          type: "planets" 
        },
        {
          kind: "block",
          type: "roofingtiles",
        },
        {
          kind: "block",
          type: "snow",
        },
        {
          kind: "block",
          type: "sports",
        },
        {
          kind: "block",
          type: "tiles",
        },
        {
          kind: "block",
          type: "wood",
        },
        {
          kind: "block",
          type: "woodfloor",
        },
      ],
    },
    {
      kind: "category",
      name: "Physics",
      contents: [
        {
          kind: "block",
          type: "applyForce",
          inputs: {
            UNITS: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 5,
                },
              },
            },
          },
        },
      ],
    },
    {
      kind: "category",
      name: "Animations",
      contents: [
        {
          kind: "block",
          type: "animationLoop",
        },
        {
          kind: "block",
          type: "animationStart",
        },
        {
          kind: "block",
          type: "animationStop",
        },
      ],
    },
    {
      kind: "category",
      name: "Events",
      contents: [
        {
          kind: "block",
          type: "onClick",
        },
        {
          kind: "block",
          type: "onKeyPress",
        },
      ],
    },
    {
      kind: "category",
      name: "Variables",
      custom: "VARIABLE",
    },
    {
      kind: "category",
      name: "Functions",
      custom: "PROCEDURE",
    },
  ],
};
