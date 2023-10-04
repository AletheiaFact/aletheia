import { Injectable } from "@nestjs/common";
import { EditorParser } from "../../lib/editor-parser";
@Injectable()
export class EditorParseService extends EditorParser {}
