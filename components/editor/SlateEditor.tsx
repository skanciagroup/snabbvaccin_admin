import React, { useCallback, useMemo } from "react";
import {
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
  BaseEditor,
} from "slate";
import {
  Editable,
  withReact,
  Slate,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";

// Types
type CustomElement = {
  type:
    | "paragraph"
    | "heading-one"
    | "heading-two"
    | "heading-three"
    | "heading-four"
    | "heading-five"
    | "numbered-list"
    | "bulleted-list"
    | "list-item";
  children: CustomText[];
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "Start typing..." }],
  },
];

const SlateEditor = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    [],
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [],
  );

  const toggleBlock = (format: string) => {
    const isActive = isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        LIST_TYPES.includes(n.type),
      split: true,
    });

    Transforms.setNodes(editor, {
      type: (isActive
        ? "paragraph"
        : isList
        ? "list-item"
        : format) as CustomElement["type"],
    });

    if (!isActive && isList) {
      const block = { type: format as CustomElement["type"], children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  const toggleMark = (format: string) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const isBlockActive = (editor: Editor, format: string) => {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
  };

  const isMarkActive = (editor: Editor, format: string) => {
    const marks = Editor.marks(editor) as Record<string, boolean>;
    return marks ? marks[format] === true : false;
  };

  return (
    <div>
      <div className="editor-controls flex gap-2 text-sm border-b border-gray-200 p-3 bg-white rounded-t-md">
        <button
          className={`px-2 py-1 rounded hover:bg-gray-100 ${
            isBlockActive(editor, "paragraph") ? "bg-gray-200" : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock("paragraph");
          }}
        >
          <span className="font-medium">¶</span>
        </button>

        <div className="flex gap-1 border-r border-gray-200 pr-2">
          {["one", "two", "three", "four", "five"].map((level, index) => (
            <button
              key={level}
              className={`px-2 py-1 rounded hover:bg-gray-100 font-medium ${
                isBlockActive(editor, `heading-${level}`) ? "bg-gray-200" : ""
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                toggleBlock(`heading-${level}`);
              }}
            >
              H{index + 1}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          <button
            className={`px-2 py-1 rounded hover:bg-gray-100 ${
              isBlockActive(editor, "numbered-list") ? "bg-gray-200" : ""
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlock("numbered-list");
            }}
          >
            <span className="font-medium">1.</span>
          </button>
          <button
            className={`px-2 py-1 rounded hover:bg-gray-100 ${
              isBlockActive(editor, "bulleted-list") ? "bg-gray-200" : ""
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlock("bulleted-list");
            }}
          >
            <span className="font-medium">•</span>
          </button>
        </div>
      </div>

      <Slate  editor={editor} initialValue={initialValue} onChange={() => {}}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Start typing..."
          className="border border-gray-300 editor-container rounded-b-md p-4 min-h-[200px] bg-white"
          onKeyDown={(event) => {
            if (event.ctrlKey) {
              switch (event.key) {
                case "b": {
                  event.preventDefault();
                  toggleMark("bold");
                  break;
                }
              }
            }
          }}
        />
      </Slate>
    </div>
  );
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "heading-three":
      return <h3 {...attributes}>{children}</h3>;
    case "heading-four":
      return <h4 {...attributes}>{children}</h4>;
    case "heading-five":
      return <h5 {...attributes}>{children}</h5>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  if (leaf.code) children = <code>{children}</code>;
  return <span {...attributes}>{children}</span>;
};

export default SlateEditor;
