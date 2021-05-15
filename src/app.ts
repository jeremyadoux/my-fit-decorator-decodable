import { guard } from "decoders";
import { MyFirstClass } from "./test/firstClass";
import { SecondClass } from "./test/secondClass";
import { Task } from "./test/taskClass";

/*let myFirstClass = new MyFirstClass




const payloadGuard = guard(myFirstClass.toObjectDecodable(), {});

payloadGuard({attr1: "plop", attr3: true, attr4: ["plip", "toto"], attr5: [12], attr6: {
    "attr1": "",
    "attr2": 12,
    "attr3": false,
    "attr4": [
      "plop",
    ],
    "attr5": [
      1,
      2,
    ]},
    attr7: [
        {
            "attr1": "",
            "attr2": 12,
            "attr3": false,
            "attr4": [
              "plop",
            ],
            "attr5": [
              1,
              2,
            ]}

    ]
});*/

let dataJson = {attr1: "plop", attr3: true, attr4: ["plip", "toto"], attr5: [12], attr6: {
  "attr1": "",
  "attr2": 12,
  "attr3": false,
  "attr4": [
    "plop",
  ],
  "attr5": [
    1,
    2,
  ]},
  attr7: [
      {
          "attr1": "",
          "attr2": 12,
          "attr3": false,
          "attr4": [
            "plop",
          ],
          "attr5": [
            1,
            2,
          ]}

  ]
};

let task = new Task;
task.run(dataJson);