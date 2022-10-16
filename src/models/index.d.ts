import { ModelInit, MutableModel } from "@aws-amplify/datastore";

type VideoMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ImageMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Video {
  readonly id: string;
  readonly itemKey: string;
  readonly category?: string | null;
  readonly marked?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Video, VideoMetaData>);
  static copyOf(source: Video, mutator: (draft: MutableModel<Video, VideoMetaData>) => MutableModel<Video, VideoMetaData> | void): Video;
}

export declare class Image {
  readonly id: string;
  readonly itemKey: string;
  readonly marked?: boolean | null;
  readonly category?: string | null;
  readonly box: (number | null)[];
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Image, ImageMetaData>);
  static copyOf(source: Image, mutator: (draft: MutableModel<Image, ImageMetaData>) => MutableModel<Image, ImageMetaData> | void): Image;
}