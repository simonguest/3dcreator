import * as BABYLON from "babylonjs";
import { convertShapeBlockToMesh } from "../world";

// On click event handler
const onClick = (shapeBlock: ShapeBlock, statements: any, scene: BABYLON.Scene) => {
  let mesh = convertShapeBlockToMesh(shapeBlock, scene);
  if (mesh) {
    mesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnPickTrigger,
        },
        statements
      )
    );
  }
};

// On key press event handler
const onKeyPress = (key: string, statements: any, scene: BABYLON.Scene) => {
  scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnKeyDownTrigger,
        parameter: key,
      },
      statements
    )
  );
};

export { onClick, onKeyPress };
