require 'fileutils'
require 'pathname'

def remove_duplicate_files(file_list, dry_run = false)
  duplicates = {}

  # Find duplicate files
  file_list.each do |file|
    filename = File.basename(file, '.*')
    extension = File.extname(file)
    match = /^(.*)\s\((\d+)\)$/.match(filename)

    if match
      original_filename = match[1] + extension
      duplicate_number = match[2].to_i

      if duplicates.key?(original_filename)
        duplicates[original_filename] = duplicate_number if duplicate_number > duplicates[original_filename]
      else
        duplicates[original_filename] = duplicate_number
      end
    end
  end

  # Remove original files or print the list in dry-run mode
  file_list.each do |file|
    filename = File.basename(file)
    if duplicates.key?(filename)
      if dry_run
        puts "Would delete: #{file}"
      else
        File.delete(file)
      end
    end
  end
end

# Provide the directory path containing the files
directory_path = 'photos'

# Get the list of files in the directory
file_list = Dir.glob(File.join(directory_path, '*'))

# Call the function to remove duplicate files (with dry-run option)
remove_duplicate_files(file_list)
