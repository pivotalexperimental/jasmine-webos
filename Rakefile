namespace :pages do

  desc "Build Jasmine webOS for download link"
  task :zipfile do
    system "mv plugins/*.zip ." if File.exist?('plugins/*.zip')
  end

  desc "Make Download snippet"
  task :publish => :zipfile do
    require 'digest/sha1'

    File.open('_includes/download.html', 'w') do |snippet|
      snippet << "<table>\n"

      Dir.glob('*.zip').sort.reverse.each do |f|
        snippet << <<-EOM
  <tr>
    <th>File</th>
    <td><a href="#{f}">#{f}</a></td>
  </tr>
  <tr>
    <th>Version</th>
    <td>#{/jasmine-webos-plugin-(.*).zip/.match(f)[1]}</td>
  </tr>
  <tr>
    <th>Size</th>
    <td>#{File.size(f) / 1024}kb</td>
  </tr>
  <tr>
    <th>Date</th>
    <td>#{File.mtime(f).strftime("%Y/%m/%d %H:%M:%S %Z")}</td>
  </tr>
  <tr>
    <th>SHA1</th>
    <td>#{Digest::SHA1.hexdigest File.read(f)}</td>
  </tr>
        EOM
      end

      snippet << "</table>\n"
    end
#    Dir.glob('*.zip').sort.reverse.each do |f|
#      File.open('_includes/download.html', 'w') do |snippet|
#        snippet << <<-EOM
#          <table>
#            <tr>
#              <th>Download</th>
#              <th>Version</th>
#              <th>Size</th>
#              <th>Date</th>
#              <th>SHA1</th>
#            </tr>
#            <tr>
#              <td><a href="#{f}">#{f}</a></td>
#              <td>#{/jasmine-webos-plugin-(.*).zip/.match(f)[1]}</td>
#              <td>#{File.size(f) / 1024}kb</td>
#              <td>#{File.mtime(f).strftime("%Y/%m/%d %H:%M:%S %Z")}</td>
#              <td>#{Digest::SHA1.hexdigest File.read(f)}</td>
#            </tr>
#          </table>
#        EOM
#      end
#
#    end

  end

end
