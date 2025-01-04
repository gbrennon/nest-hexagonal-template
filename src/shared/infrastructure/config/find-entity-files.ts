import { join } from "path";
import { globSync } from "glob";

export function findEntityFiles(): string[] {
  // Define the glob pattern to search for all `.entity.ts` files
  const entityPattern = join(__dirname, "../../../../../**/*.entity.ts");

  console.log('__dirname', __dirname);
  console.log("Entity Pattern:", entityPattern);

  // Use glob to find files matching the pattern
  const entityFiles = globSync(entityPattern, { absolute: true });

  console.log("Entity Files Found:", entityFiles);
  return entityFiles;
}
