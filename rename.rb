require 'exifr/jpeg'
require 'fileutils'
require 'json'
require 'date'
require 'optparse'

@folder_path = 'photos'

def remame_based_on_date(folder_path)
  files = Dir.glob(File.join(folder_path, '*.{jpeg,mov}'))

  files.each do |file|
    # If the file's name already matches the pattern YYYYMMDD.HHMM.*, skip it
    next if File.basename(file) =~ /\d{8}\.\d+/

    begin
      if File.extname(file) == '.jpeg'
        metadata = EXIFR::JPEG.new(file).date_time
      elsif File.extname(file) == '.mov'
        ffprobe_output = `ffprobe -v quiet -print_format json -show_format -show_entries format_tags=com.apple.quicktime.creationdate "#{file}"`
        creation_time = JSON.parse(ffprobe_output)['format']['tags']['com.apple.quicktime.creationdate']
        metadata = DateTime.parse(creation_time) if creation_time
      else
        puts "Unsupported file format: #{file}"
        next
      end

      if metadata.nil?
        puts "Metadata not found for file: #{file}"
        next
      end

      new_filename = metadata.strftime('%Y%m%d.%H%S') + File.extname(file)
      new_filepath = File.join(folder_path, new_filename)

      FileUtils.mv(file, new_filepath)

      puts "Renamed file: #{file} to #{new_filepath}"
    rescue EXIFR::MalformedJPEG
      puts "Malformed JPEG file: #{file}"
    rescue ArgumentError
      puts "Error renaming the file: #{file}"
    end
  end
end

def invert_file_names(folder_path)
  files = Dir.glob(File.join(folder_path, '*.{jpeg,mov}'))
  files.each do |f|
    # If the file's name already matches the pattern of inverted names (numbers with decimal), skip it
    next if (File.basename(f) =~ /\d+\.\d+\..*/ && !(File.basename(f)[0..3].to_i < 2100))

    new_basename = (100_000_000 - File.basename(f, '.*').to_f).to_s + File.extname(f)
    new_filepath = File.join(folder_path, new_basename)
    puts "Moving #{File.basename(f)} to #{new_filepath}"
    FileUtils.mv(f, new_filepath)
  end
end

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: ruby rename.rb [options]"

  opts.on('-r', '--reverse', 'Invert file names') do |v|
    options[:reverse] = v
  end

  opts.on('-f', '--file-path PATH', 'Directory where photos are stored') do |v|
    options[:file_path] = v
  end
end.parse!

remame_based_on_date(options[:file_path] || 'photos')
invert_file_names(options[:file_path] || 'photos') if options[:reverse]