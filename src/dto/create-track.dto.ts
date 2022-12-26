import { ApiProperty } from "@nestjs/swagger";

export class createTrackDto {

  @ApiProperty({example: 'Du Hast', description: 'name of musick'})
  readonly name;
  @ApiProperty({example: 'Rammstein', description: 'name of Artist'})
  readonly artist;
  @ApiProperty({example: 'Du, Du hast, Du hast mich', description: 'text of track'})
  readonly text;
}
